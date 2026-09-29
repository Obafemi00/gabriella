"use client";
import { useEffect, useMemo, useState } from "react";
import { ESSAYS } from "@/lib/prompts";
import { WORDS } from "@/lib/words";
import { escapeRegExp, formatTime } from "@/lib/utils";

const LIMIT = 40 * 60, MIN_WORDS = 250;
const draftKey = (i: number) => `gabriella:essay:${i}`;

export default function Writing() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [left, setLeft] = useState(LIMIT);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    try { setText(localStorage.getItem(draftKey(idx)) || ""); } catch { setText(""); }
    setLeft(LIMIT); setRunning(false);
  }, [idx]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => { if (left === 0) setRunning(false); }, [left]);

  function change(v: string) {
    setText(v);
    try { localStorage.setItem(draftKey(idx), v); } catch {}
  }

  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  const used = useMemo(
    () => WORDS.filter((w) => new RegExp(`\\b${escapeRegExp(w.word)}`, "i").test(text)),
    [text]
  );
  const essay = ESSAYS[idx];

  return (
    <div className="stage">
      <div className="cue">
        <p className="note">Writing Task 2</p>
        <p className="cue-topic">{essay.prompt}</p>
        <p className="note">Write at least {MIN_WORDS} words. The recommended time is 40 minutes.</p>
      </div>

      <div className="timer-row">
        <p className={`timer${left === 0 ? " timer-done" : ""}`}>{left === 0 ? "Time is up" : formatTime(left)}</p>
        <div className="toolbar">
          <button type="button" className="btn" onClick={() => setRunning(!running)} disabled={left === 0}>
            {running ? "Pause timer" : left === LIMIT ? "Start timer" : "Resume timer"}
          </button>
          <button type="button" className="btn ghost" onClick={() => { setRunning(false); setLeft(LIMIT); }}>Reset timer</button>
          <button type="button" className="btn ghost" onClick={() => setIdx((idx + 1) % ESSAYS.length)}>Next question</button>
        </div>
      </div>

      <label className="field full">Your essay
        <textarea rows={16} value={text} onChange={(e) => change(e.target.value)} placeholder="Start writing here. Your draft is saved in this browser." />
      </label>
      <p className={`wordcount${count >= MIN_WORDS ? " ok" : ""}`}>
        {count} words{count < MIN_WORDS ? `, ${MIN_WORDS - count} to go` : ", minimum reached"}
      </p>

      <div className="suggest">
        <p className="note">Words from your list you have used: {used.length}</p>
        {used.length > 0 && <div className="chips">{used.map((w) => <span key={w.word} className="chip" data-s="k">{w.word}</span>)}</div>}
      </div>
    </div>
  );
}
