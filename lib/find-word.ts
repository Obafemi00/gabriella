// Finds a word in its example sentence: the headword itself or a natural form of it.
// Shared by the Quiz gap-fill and scripts/validate-words.mjs (and build-words.mjs), so
// the quiz can blank every example the validator accepts.
//
// Forms: -s, -es, y → -ies / -ied, -ed, -d, -ing, dropped e ("recycling"), doubled final
// consonant ("planned"). In a phrase only the last word is inflected ("role models").
// Over-generating ("lawed") is harmless: forms are only used to find the word.

export function wordForms(word: string): string[] {
  const i = word.lastIndexOf(" ") + 1;
  const head = word.slice(0, i), w = word.slice(i);
  const out = new Set([w, `${w}s`, `${w}es`, `${w}ed`, `${w}ing`]);
  if (w.endsWith("e")) { out.add(`${w}d`); out.add(`${w.slice(0, -1)}ing`); }
  if (/[^aeiou]y$/.test(w)) { out.add(`${w.slice(0, -1)}ies`); out.add(`${w.slice(0, -1)}ied`); }
  if (/[^aeiou][aeiou][b-df-hj-np-tvz]$/.test(w)) { out.add(`${w}${w.at(-1)}ed`); out.add(`${w}${w.at(-1)}ing`); }
  return [...out].map((f) => head + f);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Every whole-word occurrence of the word or one of its forms (longest form wins). */
export function findAll(word: string, ex: string): { start: number; end: number; text: string }[] {
  const alts = wordForms(word).sort((a, b) => b.length - a.length).map(escape).join("|");
  const re = new RegExp(`(?<![A-Za-z])(?:${alts})(?![A-Za-z])`, "gi");
  return [...ex.matchAll(re)].map((m) => ({ start: m.index, end: m.index + m[0].length, text: m[0] }));
}

/** The first occurrence, or null if the example does not contain the word. */
export function findWord(word: string, ex: string) {
  return findAll(word, ex)[0] ?? null;
}

/** The example with the word form replaced by a blank, or null if it is not found. */
export function blankWord(word: string, ex: string, blank = "_____"): string | null {
  const m = findWord(word, ex);
  return m ? ex.slice(0, m.start) + blank + ex.slice(m.end) : null;
}
