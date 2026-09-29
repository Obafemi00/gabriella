"use client";
import { useMemo, useState } from "react";
import { GROUPS, WORDS, type Word } from "@/lib/words";
import { useProgress, setStatus, resetProgress, type Status } from "@/lib/progress";
import { passes, shuffle, type Filter } from "@/lib/utils";
import WordDialog from "./WordDialog";
import ProgressSummary from "./ProgressSummary";

type Order = "default" | "within" | "all";

export default function WordMountain() {
  const progress = useProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const [order, setOrder] = useState<Order>("default");
  const [current, setCurrent] = useState<Word | null>(null);

  const layout = useMemo(() => {
    if (order === "all") return [{ name: "All topics, shuffled", items: shuffle(WORDS) }];
    return GROUPS.map((g, gi) => {
      const items = WORDS.filter((w) => w.gi === gi);
      return { name: g.name, items: order === "within" ? shuffle(items) : items };
    });
  }, [order]);

  const visible = layout
    .map((g) => ({
      name: g.name,
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

  return (
    <>
      <ProgressSummary />
      <div className="toolbar">
        <label className="field">Show
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="all">All words</option>
            <option value="notknown">Everything not yet known</option>
            <option value="d">Don&apos;t know only</option>
            <option value="u">Unsure only</option>
            <option value="none">Not yet reviewed</option>
          </select>
        </label>
        <label className="field">Order
          <select value={order} onChange={(e) => setOrder(e.target.value as Order)}>
            <option value="default">By topic</option>
            <option value="within">Shuffle within topics</option>
            <option value="all">Shuffle everything</option>
          </select>
        </label>
      </div>

      {visible.length === 0 && <p className="empty">No words match this filter. Choose All words to see everything.</p>}

      {visible.map((g) => (
        <section key={g.name} className="group">
          <div className="group-head">
            <h2>{g.name}</h2>
            <small>{g.known} of {g.total} known</small>
          </div>
          <div className="chips">
            {g.shown.map((w) => (
              <button key={w.word} type="button" className="chip" data-s={progress[w.word]} onClick={() => setCurrent(w)}>
                {w.word}
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

      <WordDialog
        word={current}
        status={current ? progress[current.word] : undefined}
        onClose={() => setCurrent(null)}
        onMark={mark}
        onNext={() => current && next(current)}
        onClear={() => current && setStatus(current.word, null)}
      />
    </>
  );
}
