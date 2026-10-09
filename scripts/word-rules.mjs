// The checks every word must pass before it goes into the app. Used by
// scripts/validate-words.mjs (report) and scripts/build-words.mjs (generate lib/words.ts).
//
// Rows with status "todo" are not written yet, so only their word is checked (for
// duplicates). Every other row must pass all checks.

import { readFileSync } from "node:fs";
import { findAll } from "../lib/find-word.ts";

export const COLUMNS = ["word", "pos", "def", "ex", "col", "status", "group"];
export const GROUP_SIZE = 30;
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
export function parseCsv(text) {
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

function usSpellings(text) {
  return (text.toLowerCase().match(/[a-z]+/g) ?? []).filter((w) => US_WORDS.has(w) || (IZE.test(w) && !IZE_OK.has(w)));
}

/** Words whose spelling and group must never change (saved progress is keyed by the word). */
export function readLocked(file) {
  return parseCsv(readFileSync(file, "utf8").replace(/^﻿/, "")).slice(1)
    .filter((r) => r[0]).map(([word, group]) => ({ word, group: Number(group) }));
}

/**
 * Word families (content/word-families.csv): members separated by "; ". Members of one
 * family must be in different groups, so a learner never meets economy and economic on
 * the same day and the quiz never offers them side by side.
 */
export function readFamilies(file) {
  return parseCsv(readFileSync(file, "utf8").replace(/^﻿/, "")).slice(1)
    .filter((r) => r[0]).map((r) => r[0].split(";").map((w) => w.trim()).filter(Boolean));
}

/**
 * Checks the CSV text. Returns { words, counts, errors }, where words are the approved rows
 * as { word, pos, def, ex, col, group } in file order.
 */
export function checkWords(text, locked = [], families = []) {
  const rows = parseCsv(text.replace(/^﻿/, ""));
  const header = rows.shift() ?? [];
  const errors = [];
  const err = (line, word, msg) => errors.push(`  line ${line} ${word ? `"${word}"` : ""}: ${msg}`);

  if (header.join(",") !== COLUMNS.join(",")) {
    err(1, "", `columns must be ${COLUMNS.join(", ")} (found ${header.join(", ")})`);
  }

  const seen = new Map();
  const counts = { total: 0, todo: 0, draft: 0, approved: 0 };
  const groupSizes = new Map();
  const words = [];
  rows.forEach((cells, i) => {
    const line = i + 2;
    if (cells.length === 1 && cells[0] === "") return; // blank line
    counts.total++;
    if (cells.length !== COLUMNS.length) { err(line, cells[0], `expected ${COLUMNS.length} columns, found ${cells.length}`); return; }
    const [word, pos, def, ex, col, status, groupText] = cells.map((c) => c.trim());

    if (!word) { err(line, "", "word is empty"); return; }
    const key = word.toLowerCase();
    if (seen.has(key)) err(line, word, `duplicate word (first on line ${seen.get(key)})`);
    else seen.set(key, line);

    if (!STATUS.has(status)) { err(line, word, `status must be one of ${[...STATUS].join(", ")} (found "${status}")`); return; }
    counts[status]++;

    // Group: a positive whole number for approved words; optional before that.
    const group = Number(groupText);
    if (groupText && !(Number.isInteger(group) && group > 0)) err(line, word, `group must be a positive whole number (found "${groupText}")`);
    else if (status === "approved" && !groupText) err(line, word, "approved words need a group");
    else if (groupText) groupSizes.set(group, (groupSizes.get(group) ?? 0) + 1);

    if (status === "todo") return;

    // Type
    if (!POS.has(pos)) err(line, word, `type must be one of ${[...POS].join(", ")} (found "${pos}")`);

    // Definition
    if (!def) err(line, word, "definition is empty");

    // Example: the word, or one of its natural forms ("policies", "recycled"), must appear
    // exactly once as a whole word (lib/find-word.ts, the same matcher the quiz uses). The
    // bare word must also not appear anywhere else in the sentence, e.g. inside a longer
    // word ("mental" in "environmental").
    if (!ex) err(line, word, "example is empty");
    else {
      const whole = findAll(word, ex);
      const any = ex.match(new RegExp(escape(word), "gi")) ?? [];
      if (whole.length === 0) err(line, word, any.length ? "word in the example is part of a longer word" : "example does not contain the word or a common form of it");
      else if (whole.length > 1) err(line, word, `example contains the word ${whole.length} times (${whole.map((m) => m.text).join(", ")})`);
      else if (any.length > 1) err(line, word, `example contains "${word}" ${any.length} times, counting inside longer words`);
    }

    // Collocations: 2 or 3, comma-separated, none empty (so no commas inside one)
    const cols = col.split(",").map((c) => c.trim());
    if (!col || cols.some((c) => !c)) err(line, word, `collocations have an empty item: "${col}"`);
    else if (cols.length < 2 || cols.length > 3) err(line, word, `needs 2 or 3 collocations, found ${cols.length}: "${col}"`);

    // British spelling
    for (const [name, value] of [["word", word], ["definition", def], ["example", ex], ["collocations", col]]) {
      const us = usSpellings(value);
      if (us.length) err(line, word, `American spelling in ${name}: ${us.join(", ")}`);
    }

    if (status === "approved") words.push({ word, pos, def, ex, col, group });
  });

  for (const [g, n] of [...groupSizes].sort((a, b) => a[0] - b[0])) {
    if (n > GROUP_SIZE) err("-", "", `group ${g} has ${n} words (maximum ${GROUP_SIZE})`);
  }

  // Locked words: same spelling (exact case), same group, still approved.
  const byWord = new Map(words.map((w) => [w.word, w]));
  for (const l of locked) {
    const w = byWord.get(l.word);
    if (!w) err("-", l.word, "locked word is missing, renamed or not approved (saved progress uses the exact word)");
    else if (w.group !== l.group) err("-", l.word, `locked word must stay in group ${l.group} (found ${w.group})`);
  }

  // Families: every member must exist (so a rename is noticed), and no two in one group.
  const allWords = new Set(seen.keys());
  const groupOf = new Map(words.map((w) => [w.word, w.group]));
  families.forEach((members, i) => {
    const label = `family ${i + 1} (${members.join(", ")})`;
    if (members.length < 2) err("-", "", `${label} needs at least 2 members`);
    for (const m of members) if (!allWords.has(m.toLowerCase())) err("-", m, `${label}: word is not in the list`);
    const byGroup = new Map();
    for (const m of members) {
      const g = groupOf.get(m);
      if (g !== undefined) byGroup.set(g, [...(byGroup.get(g) ?? []), m]);
    }
    for (const [g, ms] of byGroup) if (ms.length > 1) err("-", "", `${label}: ${ms.join(" and ")} are both in group ${g}`);
  });

  return { words, counts, errors };
}
