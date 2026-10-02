"use client";
import { useEffect, useRef } from "react";
import type { Word } from "@/lib/words";
import type { Status } from "@/lib/progress";
import WordDetailPanel from "./WordDetailPanel";

type Props = {
  word: Word | null;
  status?: Status;
  onClose: () => void;
  onMark: (s: Status) => void;
  onNext: () => void;
  onClear: () => void;
};

// On desktop the word detail lives in the persistent pane rendered by WordMountain,
// so this dialog only opens as a mobile bottom sheet.
export default function WordDialog({ word, status, onClose, onMark, onNext, onClear }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const isDesktop = window.matchMedia("(min-width: 860px)").matches;
    if (isDesktop) {
      if (d.open) d.close();
      return;
    }
    if (word && !d.open) d.showModal();
    if (!word && d.open) d.close();
  }, [word]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 860px)");
    function sync() {
      const d = ref.current;
      if (mq.matches && d?.open) d.close();
    }
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <dialog
      ref={ref}
      className="dialog word-sheet"
      aria-label={word ? word.word : "Word"}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      {word && (
        <div className="dialog-body">
          <div className="sheet-handle" aria-hidden="true" />
          <WordDetailPanel word={word} status={status} onMark={onMark} onNext={onNext} onClear={onClear} onClose={onClose} />
        </div>
      )}
    </dialog>
  );
}
