"use client";
import { wordsInGroup, type Word } from "@/lib/words";
import type { Progress } from "@/lib/progress";
import { STATUS_LABEL } from "@/lib/utils";

type Props = {
  groups: number;            // groups open today: 1 to `groups`
  newGroup: number | null;
  today: Progress;
  matches: (w: Word) => boolean;
  current: string | null;
  isDesktop: boolean;
  onGroup: (g: number) => void;
  onWord: (w: Word) => void;
};

// A small map of every open word: one column of cells per group, each column a step
// higher than the one before, up to the newest group.
export default function RidgeMap({ groups, newGroup, today, matches, current, isDesktop, onGroup, onWord }: Props) {
  const cols = Array.from({ length: groups }, (_, i) => i + 1);
  return (
    <nav className="ridge" aria-label="Groups">
      {cols.map((g) => {
        const ws = wordsInGroup(g);
        const marked = ws.filter((w) => today[w.word]).length;
        const isNew = g === newGroup;
        return (
          <div key={g} className="ridge-col" style={{ ["--step" as string]: g - 1 }}>
            <span className="ridge-new">{isNew && <span className="tag-new">New</span>}</span>
            {/* Cells are a mouse shortcut on desktop; keyboard users reach every word from the list. */}
            <span className="ridge-cells" aria-hidden="true" onClick={isDesktop ? undefined : () => onGroup(g)}>
              {ws.map((w) => {
                const s = today[w.word];
                return (
                  <span
                    key={w.word}
                    className={`ridge-cell s-${s ?? "n"}`}
                    data-dim={!matches(w) || undefined}
                    data-current={current === w.word || undefined}
                    title={isDesktop ? `${w.word}: ${s ? STATUS_LABEL[s] : "Not marked"}` : undefined}
                    onClick={isDesktop ? () => onWord(w) : undefined}
                  />
                );
              })}
            </span>
            <button type="button" className="ridge-label" data-new={isNew || undefined} onClick={() => onGroup(g)}>
              <b>G{g}</b>
              <span className="ridge-meta">{marked}/{ws.length}</span>
              <span className="sr-only">Group {g}{isNew ? ", new" : ""}, {marked} of {ws.length} marked</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
