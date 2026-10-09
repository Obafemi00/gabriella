#!/usr/bin/env node
// Checks the word list before it goes into the app.
//
//   node scripts/validate-words.mjs [file]      (default: content/words-master.csv)
//
// The rules are in scripts/word-rules.mjs. Exits with code 1 on any error.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";
import { checkWords, readFamilies, readLocked } from "./word-rules.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const file = resolve(ROOT, process.argv[2] ?? "content/words-master.csv");
// Locked words and families belong to the master list, so they are skipped for other files.
const locked = process.argv[2] ? [] : readLocked(resolve(ROOT, "content/locked-words.csv"));
const families = process.argv[2] ? [] : readFamilies(resolve(ROOT, "content/word-families.csv"));

const { counts, errors } = checkWords(readFileSync(file, "utf8"), locked, families);
const checked = counts.draft + counts.approved;
console.log(`${relative(ROOT, file)}: ${counts.total} words (${checked} written: ${counts.draft} draft, ${counts.approved} approved; ${counts.todo} todo)`);
if (errors.length) {
  console.log(`FAIL: ${errors.length} problem${errors.length === 1 ? "" : "s"}`);
  console.log(errors.join("\n"));
  process.exit(1);
}
console.log(`PASS: all ${checked} written words pass; no duplicate words${locked.length ? `; ${locked.length} locked words unchanged` : ""}${families.length ? `; ${families.length} word families in separate groups` : ""}`);
