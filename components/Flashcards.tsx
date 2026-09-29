"use client";
import { useEffect, useState } from "react";
import { GROUPS, byGroup, type Word } from "@/lib/words";
import { useProgress, setStatus, type Status } from "@/lib/progress";
import { isTyping, passes, shuffle, type Filter } from "@/lib/utils";
import WordDetails from "./WordDetails";
import RateButtons from "./RateButtons";

export default function Flashcards() {
  const progress = useProgress();
  const [group, setGroup] = useState("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [deck, setDeck] = useState<Word[] | null>(null);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState({ k: 0, u: 0, d: 0 });
  const [missed, setMissed] = useState<Word[]>([]);
  const [message, setMessage] = useState("");

  function start(cards: Word[]) {
    setDeck(shuffle(cards)); setI(0); setFlipped(false);
    setTally({ k: 0, u: 0, d: 0 }); setMissed([]); setMessage("");
  }
  function begin() {
    const cards = byGroup(group).filter((w) => passes(progress[w.word], filter));
    if (!cards.length) { setDeck(null); setMessage("No cards match. Choose All cards or another topic."); return; }
    start(cards);
  }
  function rate(r: Status) {
    if (!deck) return;
    const w = deck[i];
    setStatus(w.word, r);
    setTally((t) => ({ ...t, [r]: t[r] + 1 }));
    if (r !== "k") setMissed((m) => [...m, w]);
    setI(i + 1); setFlipped(false);
  }

  const active = !!deck && i < deck.length;
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); }
      const m = ({ "1": "k", "2": "u", "3": "d" } as Record<string, Status>)[e.key];
      if (m && flipped) { e.preventDefault(); rate(m); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div className="toolbar">
        <label className="field">Topic
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">All topics</option>
            {GROUPS.map((g, gi) => <option key={g.name} value={gi}>{g.name}</option>)}
          </select>
        </label>
        <label className="field">Cards
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="all">All cards</option>
            <option value="notknown">Not yet known</option>
            <option value="d">Don&apos;t know only</option>
            <option value="none">Not yet reviewed</option>
          </select>
        </label>
        <button type="button" className="btn" onClick={begin}>Start cards</button>
      </div>

      <div className="stage">
        {!deck && (
          <p className="empty">{message || "Choose a topic and press Start cards. Tap a card or press Space to turn it over, then rate it with 1, 2 or 3."}</p>
        )}

        {deck && active && (
          <>
            <div className="counter"><span>Card {i + 1} of {deck.length}</span><span>{deck[i].group}</span></div>
            <div
              className="card"
              role="button"
              tabIndex={0}
              aria-label={flipped ? "Hide the meaning" : "Show the meaning"}
              onClick={() => setFlipped(!flipped)}
            >
              {flipped ? (
                <WordDetails w={deck[i]} />
              ) : (
                <>
                  <p className="word word-lg">{deck[i].word}</p>
                  <p className="pos">{deck[i].pos}</p>
                  <p className="hint">Tap or press Space to see the meaning</p>
                </>
              )}
            </div>
            {flipped && <RateButtons onRate={rate} />}
          </>
        )}

        {deck && !active && (
          <div>
            <p className="score">{tally.k} / {deck.length}</p>
            <p>You knew {tally.k}, were unsure of {tally.u} and didn&apos;t know {tally.d}.</p>
            <div className="toolbar">
              <button type="button" className="btn" onClick={() => start(deck)}>Study the same cards again</button>
              {missed.length > 0 && (
                <button type="button" className="btn ghost" onClick={() => start(missed)}>Review the {missed.length} I missed</button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
