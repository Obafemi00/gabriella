#!/usr/bin/env node
// Checks the word list before it goes into the app.
//
//   node scripts/validate-words.mjs [file]      (default: content/words-master.csv)
//
// Rows with status "todo" are not written yet, so only their word is checked (for
// duplicates). Every other row must pass all checks. Exits with code 1 on any error.
//
// Examples may use the word or a common inflected form of it (from batch 5 onwards).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const file = resolve(ROOT, process.argv[2] ?? "content/words-master.csv");

const COLUMNS = ["word", "pos", "def", "ex", "col", "status"];
const POS = new Set(["noun", "verb", "adjective", "adverb", "phrase", "linker"]);
const STATUS = new Set(["todo", "draft", "approved"]);

// American spellings to reject. Ambiguous words (program, meter, license, practice,
// tire, check, judgment) are left out on purpose.
const US_WORDS = new Set(`
  color colors colored colorful favor favors favored favorite favorable honor honors honored
  labor labored neighbor neighbors neighborhood neighborhoods behavior behaviors behavioral humor
  rumor rumors flavor flavors harbor endeavor endeavors vapor savior glamor tumor armor
  center centers centered centimeter theater theaters fiber fibers liter liters caliber somber
  defense offense pretense traveled traveling traveler travelers canceled canceling modeled modeling
  labeled labeling fueled fueling counseling counselor leveled signaled totaled
  catalog catalogs dialog analog aging gray mold molded jewelry aluminum enroll enrolls enrollment
  fulfill fulfills fulfillment skillful willful installment percent airplane plow cozy
  analyze analyzed analyzing paralyze paralyzed catalyze
`.trim().split(/\s+/));
// -ize/-ization endings that are correct in British English too.
const IZE_OK = new Set(["size", "sizes", "sized", "prize", "prizes", "prized", "seize", "seizes", "seized",
  "seizing", "capsize", "maize", "baize", "downsize", "downsized", "downsizing", "oversized", "citizen", "citizens"]);
const IZE = /^[a-z]+iz(e|es|ed|ing|ation|ations|er|ers)$/;

// Small CSV parser: quoted fields, doubled quotes, commas and newlines inside quotes.
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The word plus its common inflected forms (-s, -es, -ed, -ing, y → ies/ied, drop -e,
// doubled final consonant). Only the last word of a phrase is inflected. Over-generating
// ("lawed") is harmless: the forms are only used to find the word in the example.
function forms(word) {
  const i = word.lastIndexOf(" ") + 1;
  const head = word.slice(0, i), w = word.slice(i);
  const out = new Set([w, `${w}s`, `${w}es`, `${w}ed`, `${w}ing`]);
  if (w.endsWith("e")) { out.add(`${w}d`); out.add(`${w.slice(0, -1)}ing`); }
  if (/[^aeiou]y$/.test(w)) { out.add(`${w.slice(0, -1)}ies`); out.add(`${w.slice(0, -1)}ied`); }
  if (/[^aeiou][aeiou][b-df-hj-np-tvz]$/.test(w)) { out.add(`${w}${w.at(-1)}ed`); out.add(`${w}${w.at(-1)}ing`); }
  return [...out].map((f) => head + f);
}

function usSpellings(text) {
  return (text.toLowerCase().match(/[a-z]+/g) ?? []).filter((w) => US_WORDS.has(w) || (IZE.test(w) && !IZE_OK.has(w)));
}

const rows = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
const header = rows.shift() ?? [];
const errors = [];
const err = (line, word, msg) => errors.push(`  line ${line} ${word ? `"${word}"` : ""}: ${msg}`);

if (header.join(",") !== COLUMNS.join(",")) {
  err(1, "", `columns must be ${COLUMNS.join(", ")} (found ${header.join(", ")})`);
}

const seen = new Map();
const counts = { todo: 0, draft: 0, approved: 0 };
rows.forEach((cells, i) => {
  const line = i + 2;
  if (cells.length === 1 && cells[0] === "") return; // blank line
  if (cells.length !== COLUMNS.length) { err(line, cells[0], `expected ${COLUMNS.length} columns, found ${cells.length}`); return; }
  const [word, pos, def, ex, col, status] = cells.map((c) => c.trim());

  if (!word) { err(line, "", "word is empty"); return; }
  const key = word.toLowerCase();
  if (seen.has(key)) err(line, word, `duplicate word (first on line ${seen.get(key)})`);
  else seen.set(key, line);

  if (!STATUS.has(status)) { err(line, word, `status must be one of ${[...STATUS].join(", ")} (found "${status}")`); return; }
  counts[status]++;
  if (status === "todo") return;

  // Type
  if (!POS.has(pos)) err(line, word, `type must be one of ${[...POS].join(", ")} (found "${pos}")`);

  // Definition
  if (!def) err(line, word, "definition is empty");

  // Example: the word, or one of its common inflected forms ("policies", "recycled"), must
  // appear exactly once as a whole word. The bare word must also not appear anywhere else
  // in the sentence, e.g. inside a longer word ("mental" in "environmental").
  if (!ex) err(line, word, "example is empty");
  else {
    const alts = forms(word).sort((a, b) => b.length - a.length).map(escape).join("|");
    const whole = ex.match(new RegExp(`(?<![A-Za-z])(?:${alts})(?![A-Za-z])`, "gi")) ?? [];
    const any = ex.match(new RegExp(escape(word), "gi")) ?? [];
    if (whole.length === 0) err(line, word, any.length ? "word in the example is part of a longer word" : "example does not contain the word or a common form of it");
    else if (whole.length > 1) err(line, word, `example contains the word ${whole.length} times (${whole.join(", ")})`);
    else if (any.length > 1) err(line, word, `example contains "${word}" ${any.length} times, counting inside longer words`);
  }

  // Collocations: 2 or 3, comma-separated, none empty (so no commas inside one)
  const cols = col.split(",").map((c) => c.trim());
  if (!col || cols.some((c) => !c)) err(line, word, `collocations have an empty item: "${col}"`);
  else if (cols.length < 2 || cols.length > 3) err(line, word, `needs 2 or 3 collocations, found ${cols.length}: "${col}"`);

  // British spelling
  for (const [name, text] of [["word", word], ["definition", def], ["example", ex], ["collocations", col]]) {
    const us = usSpellings(text);
    if (us.length) err(line, word, `American spelling in ${name}: ${us.join(", ")}`);
  }
});

const checked = counts.draft + counts.approved;
console.log(`${relative(ROOT, file)}: ${rows.length} words (${checked} written: ${counts.draft} draft, ${counts.approved} approved; ${counts.todo} todo)`);
if (errors.length) {
  console.log(`FAIL: ${errors.length} problem${errors.length === 1 ? "" : "s"}`);
  console.log(errors.join("\n"));
  process.exit(1);
}
console.log(`PASS: all ${checked} written words pass; no duplicate words`);
