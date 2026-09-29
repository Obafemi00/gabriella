"use client";
import { WORDS } from "@/lib/words";
import { useProgress } from "@/lib/progress";

export default function ProgressSummary() {
  const p = useProgress();
  const c = { k: 0, u: 0, d: 0, n: 0 };
  WORDS.forEach((w) => { c[p[w.word] ?? "n"]++; });
  const pct = (x: number) => `${(x / WORDS.length) * 100}%`;
  return (
    <div className="summary">
      <div className="bar" aria-hidden="true">
        <span style={{ width: pct(c.k), background: "var(--know)" }} />
        <span style={{ width: pct(c.u), background: "var(--unsure)" }} />
        <span style={{ width: pct(c.d), background: "var(--dont)" }} />
      </div>
      <p className="legend">
        <span><i className="dot" style={{ background: "var(--know)" }} />Know <b>{c.k}</b></span>
        <span><i className="dot" style={{ background: "var(--unsure)" }} />Unsure <b>{c.u}</b></span>
        <span><i className="dot" style={{ background: "var(--dont)" }} />Don&apos;t know <b>{c.d}</b></span>
        <span><i className="dot" style={{ background: "var(--unseen)" }} />Not yet reviewed <b>{c.n}</b></span>
      </p>
    </div>
  );
}
