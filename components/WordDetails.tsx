"use client";
import { Volume2, X } from "lucide-react";
import type { Word } from "@/lib/words";
import { speak, useCanSpeak } from "@/lib/utils";

export default function WordDetails({ w, groupLabel, onDismiss }: { w: Word; groupLabel?: string; onDismiss?: () => void }) {
  const canSpeak = useCanSpeak();
  return (
    <>
      <div className="word-head">
        <div className="word-head-top">
          <div className="word-head-text">
            {groupLabel && <p className="word-group">{groupLabel}</p>}
            <p className="word">{w.word}</p>
            <p className="pos">{w.pos}</p>
          </div>
          {onDismiss && (
            <button type="button" className="word-close" aria-label="Close word details" onClick={onDismiss}>
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>
        {canSpeak && (
          <button type="button" className="btn-small" onClick={(e) => { e.stopPropagation(); speak(w.word); }}>
            <Volume2 size={18} aria-hidden="true" />Listen
          </button>
        )}
      </div>
      <div className="word-sect">
        <p className="word-sect-label">Meaning</p>
        <p className="def">{w.def}</p>
      </div>
      <div className="word-sect">
        <p className="word-sect-label">Example</p>
        <p className="ex">&ldquo;{w.ex}&rdquo;</p>
      </div>
      <div className="word-sect">
        <p className="word-sect-label">Collocations</p>
        <ul className="cols">
          {w.col.split(/,\s*/).map((c) => <li key={c}>{c}</li>)}
        </ul>
      </div>
    </>
  );
}
