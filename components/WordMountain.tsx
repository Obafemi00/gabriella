"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { GROUPS, WORDS, type Word } from "@/lib/words";
import { useProgress, setStatus, resetProgress, type Status } from "@/lib/progress";
import { passes, shuffle, isTyping, type Filter } from "@/lib/utils";
import WordDialog from "./WordDialog";
import WordDetailPanel from "./WordDetailPanel";
import ProgressSummary from "./ProgressSummary";

type Order = "default" | "within" | "all";

const SHOWS: { value: Filter; label: string }[] = [
  { value: "all", label: "All words" },
  { value: "notknown", label: "Not yet known" },
  { value: "d", label: "Don't know" },
  { value: "u", label: "Unsure" },
  { value: "none", label: "Not reviewed" },
];
const ORDERS: { value: Order; label: string }[] = [
  { value: "default", label: "By topic" },
  { value: "within", label: "Shuffle within topics" },
  { value: "all", label: "Shuffle everything" },
];

export default function WordMountain() {
  const progress = useProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const [order, setOrder] = useState<Order>("default");
  const [current, setCurrent] = useState<Word | null>(null);

  const layout = useMemo(() => {
    if (order === "all") return [{ name: "All topics, shuffled", gi: -1, items: shuffle(WORDS) }];
    return GROUPS.map((g, gi) => {
      const items = WORDS.filter((w) => w.gi === gi);
      return { name: g.name, gi, items: order === "within" ? shuffle(items) : items };
    });
  }, [order]);

  const visible = layout
    .map((g) => ({
      name: g.name,
      gi: g.gi,
      total: g.items.length,
      known: g.items.filter((w) => progress[w.word] === "k").length,
      shown: g.items.filter((w) => passes(progress[w.word], filter)),
    }))
    .filter((g) => g.shown.length > 0);
  const flat = visible.flatMap((g) => g.shown);

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

  function jump(gi: number) {
    document.getElementById(`topic-${gi}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <ProgressSummary />

      <div className="filters">
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
              onClick={() => setOrder(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="words-layout">
        <aside className="words-index">
          <div className="words-index-head">Topics</div>
          {GROUPS.map((g, gi) => {
            const known = WORDS.filter((w) => w.gi === gi && progress[w.word] === "k").length;
            const total = WORDS.filter((w) => w.gi === gi).length;
            return (
              <button key={g.name} type="button" className="index-link" onClick={() => jump(gi)}>
                <span className="index-link-name">{g.name}</span>
                <span className="index-link-meta">{known}/{total}</span>
              </button>
            );
          })}
        </aside>

        <div className="words-main">
          {visible.length === 0 && <p className="empty">No words match this filter. Choose All words to see everything.</p>}

          {visible.map((g) => (
            <section key={g.name} id={g.gi >= 0 ? `topic-${g.gi}` : undefined} className="group">
              <div className="group-head">
                <h2>{g.name}</h2>
                <small>{g.known} of {g.total} known</small>
              </div>
              <div className="word-rows">
                {g.shown.map((w) => (
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
            </section>
          ))}

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
