"use client";
import type { Word } from "@/lib/words";
import type { Status } from "@/lib/progress";
import { STATUS_LABEL } from "@/lib/utils";
import WordDetails from "./WordDetails";
import RateButtons from "./RateButtons";

export type WordContext = {
  groupLabel: string;        // "Group 2 · New" or "Group 1 · Review"
  dayLabel: string;          // "Today, Day 3" or "Day 2" when looking back
  yesterday?: Status;
  yesterdayNote: string;     // shown when there is no yesterday mark
};

export default function WordDetailPanel({
  word,
  status,
  context,
  onMark,
  onNext,
  onClear,
  onClose,
}: {
  word: Word;
  status?: Status;
  context: WordContext;
  onMark: (s: Status) => void;
  onNext: () => void;
  onClear: () => void;
  onClose?: () => void;
}) {
  const y = context.yesterday;
  return (
    <div className="word-detail">
      <WordDetails w={word} groupLabel={context.groupLabel} />
      <div className="word-marks">
        <div className="word-marks-head">
          <span>{context.dayLabel}{status ? `: ${STATUS_LABEL[status]}` : ""}</span>
          <span className="word-marks-y">
            <span className={`status-dot s-${y ?? "n"}`} aria-hidden="true" />
            {y ? `Yesterday: ${STATUS_LABEL[y]}` : context.yesterdayNote}
          </span>
        </div>
        <RateButtons value={status} onRate={onMark} />
      </div>
      <div className="dialog-foot">
        <button type="button" className="link" onClick={onClear} disabled={!status}>Clear mark</button>
        <span>
          {onClose && <button type="button" className="link" onClick={onClose}>Close</button>}
          <button type="button" className="link" onClick={onNext}>Next word</button>
        </span>
      </div>
    </div>
  );
}
