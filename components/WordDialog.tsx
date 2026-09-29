"use client";
import { useEffect, useRef } from "react";
import type { Word } from "@/lib/words";
import type { Status } from "@/lib/progress";
import { STATUS_LABEL } from "@/lib/utils";
import WordDetails from "./WordDetails";
import RateButtons from "./RateButtons";

type Props = {
  word: Word | null;
  status?: Status;
  onClose: () => void;
  onMark: (s: Status) => void;
  onNext: () => void;
  onClear: () => void;
};

export default function WordDialog({ word, status, onClose, onMark, onNext, onClear }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (word && !d.open) d.showModal();
    if (!word && d.open) d.close();
  }, [word]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-label={word ? word.word : "Word"}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      onKeyDown={(e) => {
        const m = ({ "1": "k", "2": "u", "3": "d" } as const)[e.key as "1" | "2" | "3"];
        if (m) { e.preventDefault(); onMark(m); }
        else if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
      }}
    >
      {word && (
        <div className="dialog-body">
          <WordDetails w={word} />
          <p className="note">{status ? `Marked: ${STATUS_LABEL[status]}` : "Not yet reviewed"}</p>
          <RateButtons onRate={onMark} />
          <div className="dialog-foot">
            <button type="button" className="link" onClick={onClear}>Clear mark</button>
            <span>
              <button type="button" className="link" onClick={onClose}>Close</button>
              <button type="button" className="link" onClick={onNext}>Next word</button>
            </span>
          </div>
        </div>
      )}
    </dialog>
  );
}
