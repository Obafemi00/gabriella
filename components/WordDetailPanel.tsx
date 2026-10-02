"use client";
import type { Word } from "@/lib/words";
import type { Status } from "@/lib/progress";
import { STATUS_LABEL } from "@/lib/utils";
import WordDetails from "./WordDetails";
import RateButtons from "./RateButtons";

export default function WordDetailPanel({
  word,
  status,
  onMark,
  onNext,
  onClear,
  onClose,
}: {
  word: Word;
  status?: Status;
  onMark: (s: Status) => void;
  onNext: () => void;
  onClear: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      <WordDetails w={word} />
      <p className="note">{status ? `Marked: ${STATUS_LABEL[status]}` : "Not yet reviewed"}</p>
      <RateButtons onRate={onMark} />
      <div className="dialog-foot">
        <button type="button" className="link" onClick={onClear}>Clear mark</button>
        <span>
          {onClose && <button type="button" className="link" onClick={onClose}>Close</button>}
          <button type="button" className="link" onClick={onNext}>Next word</button>
        </span>
      </div>
    </>
  );
}
