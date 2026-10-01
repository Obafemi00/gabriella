"use client";
import { WORDS } from "@/lib/words";
import { useProgress } from "@/lib/progress";

export default function ProgressSummary() {
  const p = useProgress();
  const c = { k: 0, u: 0, d: 0, n: 0 };
  WORDS.forEach((w) => { c[p[w.word] ?? "n"]++; });
  const total = WORDS.length;
  const pct = (x: number) => `${(x / total) * 100}%`;
  const reviewed = c.k + c.u + c.d;
  const note = reviewed === 0
    ? "Nothing marked yet. Mark words as Know, Unsure or Don't know and your progress will show here."
    : `${c.u + c.d} word${c.u + c.d === 1 ? "" : "s"} still to work on. Flashcards and the quiz start with those.`;

  return (
    <div className="summary">
      <div className="summary-head">
        <span className="summary-count"><b>{c.k}</b> of {total} known</span>
        <span className="summary-pct">{Math.round((c.k / total) * 100)}%</span>
      </div>
      <div className="bar" aria-hidden="true">
        <span style={{ width: pct(c.k), background: "var(--know)" }} />
        <span style={{ width: pct(c.u), background: "var(--unsure)" }} />
        <span style={{ width: pct(c.d), background: "var(--dont)" }} />
      </div>
      <ul className="legend">
        <li><i className="dot" style={{ background: "var(--know)" }} />{c.k} know</li>
        <li><i className="dot" style={{ background: "var(--unsure)" }} />{c.u} unsure</li>
        <li><i className="dot" style={{ background: "var(--dont)" }} />{c.d} don&apos;t know</li>
        <li><i className="dot dot-outline" />{c.n} not reviewed</li>
      </ul>
      <p className="summary-note">{note}</p>
    </div>
  );
}
