#!/usr/bin/env node
// Generates lib/words.ts from content/words-master.csv (approved words only).
//
//   npm run words
//
// Stops without writing anything if the list fails any rule in scripts/word-rules.mjs.
// lib/words.ts is committed, so `npm run build` (and Vercel) never needs to run this.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { checkWords, readFamilies, readLocked, GROUP_SIZE } from "./word-rules.mjs";
import { blankWord } from "../lib/find-word.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const csv = readFileSync(resolve(ROOT, "content/words-master.csv"), "utf8");
const { words, errors } = checkWords(csv,
  readLocked(resolve(ROOT, "content/locked-words.csv")),
  readFamilies(resolve(ROOT, "content/word-families.csv")));

// The quiz must be able to blank every example (the validator already requires this).
for (const w of words) if (blankWord(w.word, w.ex) === null) errors.push(`  "${w.word}": quiz cannot find the word in its example`);

if (errors.length) {
  console.log(`FAIL: ${errors.length} problem${errors.length === 1 ? "" : "s"}; lib/words.ts was not changed`);
  console.log(errors.join("\n"));
  process.exit(1);
}

words.sort((a, b) => a.word.localeCompare(b.word, "en"));
const q = (s) => JSON.stringify(s);
const out = `// GENERATED FILE: do not edit by hand.
// Source: content/words-master.csv. Edit the CSV, then run \`npm run words\`.
// Progress is saved by the word text, so renaming a word resets its mark.
// Groups are stored in the CSV and never chosen at runtime.

export type Word = {
  word: string;
  pos: string;
  def: string;
  ex: string;
  col: string;
  group: number;
};

type Row = [word: string, pos: string, def: string, example: string, collocations: string, group: number];

const ROWS: Row[] = [
${words.map((w) => `  [${[w.word, w.pos, w.def, w.ex, w.col].map(q).join(", ")}, ${w.group}],`).join("\n")}
];

export const WORDS: Word[] = ROWS.map(([word, pos, def, ex, col, group]) => ({ word, pos, def, ex, col, group }));

export const GROUP_SIZE = ${GROUP_SIZE};
export const LAST_GROUP = Math.max(...WORDS.map((w) => w.group));
export const wordsInGroup = (g: number) => WORDS.filter((w) => w.group === g);
`;
writeFileSync(resolve(ROOT, "lib/words.ts"), out);
const groups = new Set(words.map((w) => w.group)).size;
console.log(`lib/words.ts: ${words.length} words in ${groups} groups; all ${words.length} examples found by the quiz matcher`);
