"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { WORDS, type Word } from "@/lib/words";
import { useProgress, setStatus, resetProgress, type Status } from "@/lib/progress";
import { passes, shuffle, isTyping, type Filter } from "@/lib/utils";
import WordDialog from "./WordDialog";
import WordDetailPanel from "./WordDetailPanel";
import ProgressSummary from "./ProgressSummary";

type Order = "az" | "shuffle";

const SHOWS: { value: Filter; label: string }[] = [
  { value: "all", label: "All words" },
  { value: "notknown", label: "Not yet known" },
  { value: "d", label: "Don't know" },
  { value: "u", label: "Unsure" },
  { value: "none", label: "Not reviewed" },
];
const ORDERS: { value: Order; label: string }[] = [
  { value: "az", label: "A to Z" },
  { value: "shuffle", label: "Shuffle" },
];
const AZ = [...WORDS].sort((a, b) => a.word.localeCompare(b.word));

export default function WordMountain() {
  const progress = useProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const [order, setOrder] = useState<Order>("az");
  // Bumped on every Shuffle click so choosing it again reshuffles.
  const [seed, setSeed] = useState(0);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<Word | null>(null);

  const ordered = useMemo(() => (order === "shuffle" ? shuffle(WORDS) : AZ), [order, seed]);
  const q = query.trim().toLowerCase();
  const flat = ordered.filter(
    (w) => passes(progress[w.word], filter) && (!q || w.word.toLowerCase().includes(q) || w.def.toLowerCase().includes(q))
  );

  function next(from: Word) {
    const i = flat.findIndex((x) => x.word === from.word);
    setCurrent(flat[i + 1] ?? null);
  }
  function mark(s: Status) {
    if (!current) return;
    const w = current;
    next(w);
    setStatus(w.word, s);
  }
  function clearCurrent() {
    if (current) setStatus(current.word, null);
  }

  // Keyboard shortcuts (1/2/3 mark+advance, ArrowRight advance) work whether the word is
  // showing in the mobile bottom sheet or the desktop pane, so they're wired at document
  // level. Refs keep the handler reading the latest mark/next/current without re-binding
  // the listener on every render.
  const markRef = useRef(mark);
  const nextRef = useRef(next);
  const currentRef = useRef(current);
  markRef.current = mark;
  nextRef.current = next;
  currentRef.current = current;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTyping(e)) return;
      const w = currentRef.current;
      if (!w) return;
      const m = ({ "1": "k", "2": "u", "3": "d" } as const)[e.key as "1" | "2" | "3"];
      if (m) {
        e.preventDefault();
        markRef.current(m);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextRef.current(w);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <ProgressSummary />

      <div className="filters">
        <label className="words-search">
          <span className="sr-only">Search words</span>
          <Search size={18} className="words-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words or meanings"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <div className="show-chips" role="group" aria-label="Show">
          {SHOWS.map((s) => (
            <button
              key={s.value}
              type="button"
              className="show-chip"
              aria-pressed={filter === s.value}
              onClick={() => setFilter(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="order-seg" role="group" aria-label="Order">
          {ORDERS.map((o) => (
            <button
              key={o.value}
              type="button"
              className="order-btn"
              aria-pressed={order === o.value}
              onClick={() => { setOrder(o.value); if (o.value === "shuffle") setSeed((n) => n + 1); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="words-layout">
        <div className="words-main">
          {flat.length === 0 ? (
            <p className="empty">No words match</p>
          ) : (
            <div className="word-rows">
              {flat.map((w) => (
                <button
                  key={w.word}
                  type="button"
                  className="word-row"
                  aria-current={current?.word === w.word || undefined}
                  onClick={() => setCurrent(w)}
                >
                  <span className={`status-dot s-${progress[w.word] ?? "n"}`} aria-hidden="true" />
                  <span className="word-row-name">
                    <b>{w.word}</b>
                    <i>{w.pos}</i>
                  </span>
                </button>
              ))}
            </div>
          )}

          <p className="reset-row">
            <button
              type="button"
              className="link"
              onClick={() => { if (confirm("Clear every Know, Unsure and Don't know mark? This cannot be undone.")) resetProgress(); }}
            >
              Reset all progress
            </button>
          </p>
        </div>

        <aside className="word-pane">
          {current ? (
            <WordDetailPanel
              word={current}
              status={progress[current.word]}
              onMark={mark}
              onNext={() => next(current)}
              onClear={clearCurrent}
            />
          ) : (
            <p className="word-pane-empty">Choose a word to see its meaning.</p>
          )}
        </aside>
      </div>

      <WordDialog
        word={current}
        status={current ? progress[current.word] : undefined}
        onClose={() => setCurrent(null)}
        onMark={mark}
        onNext={() => current && next(current)}
        onClear={clearCurrent}
      />
    </>
  );
}
