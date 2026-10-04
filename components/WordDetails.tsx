"use client";
import type { Word } from "@/lib/words";
import { speak, useCanSpeak } from "@/lib/utils";

export default function WordDetails({ w, showWord = true }: { w: Word; showWord?: boolean }) {
  const canSpeak = useCanSpeak();
  return (
    <>
      {showWord && (
        <div className="word-head">
          <div>
            <p className="word">{w.word}</p>
            <p className="pos">{w.pos}</p>
          </div>
          {canSpeak && (
            <button type="button" className="btn-small" onClick={(e) => { e.stopPropagation(); speak(w.word); }}>Listen</button>
          )}
        </div>
      )}
      <p className="def">{w.def}</p>
      <p className="ex">{w.ex}</p>
      <p className="col"><b>Useful with:</b> {w.col}</p>
    </>
  );
}
