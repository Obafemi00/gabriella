"use client";
import { useEffect, useRef, useState } from "react";
import { WORDS, type Word } from "@/lib/words";
import { setStatus } from "@/lib/progress";
import { escapeRegExp, isTyping, pick, shuffle } from "@/lib/utils";

type Q = { w: Word; type: "def" | "gap"; opts: Word[]; prompt: string };

function build(w: Word): Q {
  const re = new RegExp(escapeRegExp(w.word), "i");
  const type: Q["type"] = re.test(w.ex) && Math.random() < 0.5 ? "gap" : "def";
  // Same part of speech where possible, so only one option fits the meaning or sentence.
  const other = WORDS.filter((x) => x.word !== w.word);
  const samePos = other.filter((x) => x.pos === w.pos);
  const distract = pick(samePos.length >= 3 ? samePos : other, 3);
  return { w, type, opts: shuffle([w, ...distract]), prompt: type === "gap" ? w.ex.replace(re, "_____") : w.def };
}

export default function Quiz() {
  const [qs, setQs] = useState<Q[] | null>(null);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  function begin() {
    setQs(pick(WORDS, Math.min(10, WORDS.length)).map(build));
    setI(0); setScore(0); setMissed([]); setChosen(null);
  }
  function answer(j: number) {
    if (!qs || chosen !== null) return;
    const q = qs[i];
    setChosen(j);
    if (q.opts[j].word === q.w.word) setScore((s) => s + 1);
    else { setMissed((m) => [...m, q.w]); setStatus(q.w.word, "d"); }
  }
  function next() { setI(i + 1); setChosen(null); }

  useEffect(() => { if (chosen !== null) nextRef.current?.focus(); }, [chosen]);

  const active = !!qs && i < qs.length;
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      if (chosen === null && ["1", "2", "3", "4"].includes(e.key)) { e.preventDefault(); answer(Number(e.key) - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const q = active ? qs![i] : null;
  const right = q && chosen !== null && q.opts[chosen].word === q.w.word;

  return (
    <>
      <div className="toolbar">
        <button type="button" className="btn" onClick={begin}>Start quiz</button>
      </div>

      <div className="stage">
        {!qs && <p className="empty">Ten questions mixing definitions and gap-fill sentences. Words you miss are marked Don&apos;t know on the Words page.</p>}

        {q && (
          <>
            <div className="counter"><span>Question {i + 1} of {qs!.length}</span><span>Score {score}</span></div>
            <div className="q-prompt">
              <span className="q-kind">{q.type === "gap" ? "Choose the word that completes the sentence" : "Which word matches this meaning?"}</span>
              {q.prompt}
            </div>
            <div className="opts">
              {q.opts.map((o, j) => {
                let cls = "opt";
                if (chosen !== null && o.word === q.w.word) cls += " right";
                else if (chosen === j) cls += " wrong";
                return (
                  <button key={o.word} type="button" className={cls} disabled={chosen !== null} onClick={() => answer(j)}>
                    <kbd>{j + 1}</kbd> {o.word}
                  </button>
                );
              })}
            </div>
            {chosen !== null && (
              <div className="feedback" aria-live="polite">
                <p><b>{right ? "Correct." : `Not quite. The answer is ${q.w.word}.`}</b></p>
                <p className="note">{q.w.word} ({q.w.pos}): {q.w.def}.{q.type === "def" ? ` Example: ${q.w.ex}` : ""}</p>
                <button ref={nextRef} type="button" className="btn" onClick={next}>
                  {i + 1 === qs!.length ? "See my score" : "Next question"}
                </button>
              </div>
            )}
          </>
        )}

        {qs && !active && (
          <div>
            <p className="score">{score} / {qs.length}</p>
            {missed.length ? (
              <>
                <p>Words to review (now marked Don&apos;t know):</p>
                <div className="chips">{missed.map((w) => <span key={w.word} className="chip" data-s="d">{w.word}</span>)}</div>
              </>
            ) : <p>Every answer correct.</p>}
            <div className="toolbar spaced"><button type="button" className="btn" onClick={begin}>Start another quiz</button></div>
          </div>
        )}
      </div>
    </>
  );
}
