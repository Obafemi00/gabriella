"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { CUE_CARDS } from "@/lib/prompts";
import { WORDS } from "@/lib/words";
import { useProgress } from "@/lib/progress";
import { formatTime } from "@/lib/utils";

type Phase = "ready" | "prep" | "talk" | "done";
const PREP = 60, TALK = 120;

export default function Speaking() {
  const progress = useProgress();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [left, setLeft] = useState(PREP);
  const [notes, setNotes] = useState("");
  // Words ticked off while speaking. Session-only: never saved, cleared with each new cue card.
  const [used, setUsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (phase !== "prep" && phase !== "talk") return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (left > 0) return;
    if (phase === "prep") { setPhase("talk"); setLeft(TALK); }
    else if (phase === "talk") setPhase("done");
  }, [left, phase]);

  function reset(nextIdx = idx) { setIdx(nextIdx); setPhase("ready"); setLeft(PREP); setNotes(""); setUsed({}); }
  function another() {
    let n = idx;
    while (n === idx && CUE_CARDS.length > 1) n = Math.floor(Math.random() * CUE_CARDS.length);
    reset(n);
  }

  const card = CUE_CARDS[idx];
  // Still learning: Don't know first, then Unsure.
  const learning = [
    ...WORDS.filter((w) => progress[w.word] === "d"),
    ...WORDS.filter((w) => progress[w.word] === "u"),
  ].slice(0, 6);
  const nUsed = learning.filter((w) => used[w.word]).length;

  return (
    <div className="stage">
      <div className="cue">
        <p className="cue-prompt">{card.prompt}</p>
        <p className="note">You should say:</p>
        <ul>{card.points.map((p) => <li key={p}>{p}</li>)}</ul>
        <p>{card.explain}</p>
      </div>

      <div className="timer-row">
        <div>
          <p className="timer" aria-live="off">{phase === "done" ? "0:00" : formatTime(left)}</p>
          <p className="note">
            {phase === "ready" && "You get one minute to prepare, then up to two minutes to speak."}
            {phase === "prep" && "Preparation time. Make short notes."}
            {phase === "talk" && "Speak now. Keep going until the timer ends."}
            {phase === "done" && "Time is up. How did it go?"}
          </p>
        </div>
        <div className="toolbar">
          {phase === "ready" && <button type="button" className="btn" onClick={() => setPhase("prep")}>Start preparation</button>}
          {phase === "prep" && <button type="button" className="btn" onClick={() => { setPhase("talk"); setLeft(TALK); }}>Start speaking now</button>}
          {phase === "talk" && <button type="button" className="btn" onClick={() => setPhase("done")}>Finish</button>}
          {phase !== "ready" && <button type="button" className="btn ghost" onClick={() => reset()}>Start again</button>}
          <button type="button" className="btn ghost" onClick={another}>Another cue card</button>
        </div>
      </div>

      <label className="field full">Your notes
        <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Jot down key points during preparation" />
      </label>

      {learning.length > 0 && (
        <div className="suggest">
          <div className="learn-head">
            <h2 className="learn-title">Words you&apos;re still learning · tap when you&apos;ve used one</h2>
            {nUsed > 0 && <span className="learn-count">{nUsed} of {learning.length} used</span>}
          </div>
          <div className="learn-chips">
            {learning.map((w) => (
              <button
                key={w.word}
                type="button"
                className="learn-chip"
                data-s={progress[w.word]}
                aria-pressed={!!used[w.word]}
                title={w.def}
                onClick={() => setUsed((u) => ({ ...u, [w.word]: !u[w.word] }))}
              >
                {used[w.word] && <Check size={14} aria-hidden="true" />}
                {w.word}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="note">Tip: record yourself on your phone and listen back. Check your fluency, pronunciation and whether you covered every point on the card.</p>
    </div>
  );
}
