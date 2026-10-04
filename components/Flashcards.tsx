"use client";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCw, Volume2, X } from "lucide-react";
import { WORDS, type Word } from "@/lib/words";
import { useProgress, setStatus, type Status } from "@/lib/progress";
import { isTyping, passes, pick, shuffle, speak, useCanSpeak, STATUS_LABEL, type Filter } from "@/lib/utils";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All cards" },
  { value: "notknown", label: "Not yet known" },
  { value: "d", label: "Don't know only" },
  { value: "none", label: "Not yet reviewed" },
];
const SIZES: { value: number; label: string }[] = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: Infinity, label: "All" },
];
const RATES: { s: Status; key: string }[] = [
  { s: "k", key: "1" },
  { s: "u", key: "2" },
  { s: "d", key: "3" },
];

export default function Flashcards() {
  const progress = useProgress();
  const canSpeak = useCanSpeak();
  const [filter, setFilter] = useState<Filter>("all");
  const [deck, setDeck] = useState<Word[] | null>(null);
  const [size, setSize] = useState(20);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Off while a new card is swapped in, so it doesn't visibly spin back to its front.
  const [anim, setAnim] = useState(true);
  const [tally, setTally] = useState({ k: 0, u: 0, d: 0 });
  const [missed, setMissed] = useState<{ w: Word; r: Status }[]>([]);

  useEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    return () => cancelAnimationFrame(id);
  }, [anim]);

  const matches = WORDS.filter((w) => passes(progress[w.word], filter));
  const n = Math.min(size, matches.length);

  function start(cards: Word[]) {
    setDeck(shuffle(cards)); setI(0); setFlipped(false); setAnim(false);
    setTally({ k: 0, u: 0, d: 0 }); setMissed([]);
    window.scrollTo({ top: 0 });
  }
  function begin() {
    if (!n) return;
    start(pick(matches, n));
  }
  function rate(r: Status) {
    if (!deck) return;
    const w = deck[i];
    setStatus(w.word, r);
    setTally((t) => ({ ...t, [r]: t[r] + 1 }));
    if (r !== "k") setMissed((m) => [...m, { w, r }]);
    setI(i + 1); setFlipped(false); setAnim(false);
  }

  const active = !!deck && i < deck.length;
  const phase = !deck ? "setup" : active ? "card" : "end";
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      // A focused button (End round, Listen, a rate button) handles Space and Enter itself.
      const onButton = (e.target as HTMLElement | null)?.closest?.("button");
      if ((e.key === " " || e.key === "Enter") && !onButton) { e.preventDefault(); setFlipped((f) => !f); }
      const m = ({ "1": "k", "2": "u", "3": "d" } as Record<string, Status>)[e.key];
      if (m && flipped) { e.preventDefault(); rate(m); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const setupNote = n
    ? `${n} ${n === 1 ? "card" : "cards"} · about ${Math.max(1, Math.round(n * 0.35))} min`
    : "No cards match. Choose All cards.";
  const w = active ? deck[i] : null;
  const pct = (x: number) => `${deck && deck.length ? (x / deck.length) * 100 : 0}%`;

  return (
    <div className="fc" data-phase={phase}>
      <aside className="fc-side" aria-label="Choose cards">
        <div className="fc-group">
          <div className="fc-label" id="fc-cards-label">Cards</div>
          <div className="fc-filters" role="group" aria-labelledby="fc-cards-label">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className="fc-filter"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                <span className="fc-filter-n">{WORDS.filter((x) => passes(progress[x.word], f.value)).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="fc-group">
          <div className="fc-label" id="fc-size-label">Round size</div>
          <div className="fc-filters fc-sizes" role="group" aria-labelledby="fc-size-label">
            {SIZES.map((o) => (
              <button
                key={o.label}
                type="button"
                className="fc-filter"
                aria-pressed={size === o.value}
                onClick={() => setSize(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="fc-start">
          <p className="fc-note" role="status">{setupNote}</p>
          <button type="button" className="btn" onClick={begin} disabled={!n}>
            Start cards<ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <section className="fc-main">
        {phase === "setup" && (
          <div className="fc-intro">
            <h1 className="page-title">Flashcards</h1>
            <p className="lead">
              Flip each card, then say how well you knew it.
              <span className="fc-keys"> Press Space to turn a card over and 1, 2 or 3 to rate it.</span>
            </p>
          </div>
        )}

        {deck && w && (
          <>
            <h1 className="sr-only">Flashcards</h1>
            <div className="fc-top">
              <button type="button" className="fc-close" onClick={() => setDeck(null)} aria-label="End round">
                <X size={22} aria-hidden="true" className="fc-close-icon" />
                <span className="fc-close-label" aria-hidden="true">End round</span>
              </button>
              <div className="fc-counter">Card {i + 1} of {deck.length}</div>
              <div className="fc-progress" aria-hidden="true"><span style={{ width: pct(i + 1) }} /></div>
            </div>

            <div className="fc-scene">
              <div
                className="fc-card"
                data-flipped={flipped}
                data-anim={anim}
                role="button"
                tabIndex={0}
                aria-label={flipped ? "Hide the meaning" : "Show the meaning"}
                onClick={() => setFlipped(!flipped)}
              >
                <div className="fc-face fc-front" inert={flipped}>
                  <p className="fc-word">{w.word}</p>
                  <p className="fc-pos">{w.pos}</p>
                  <p className="fc-hint"><RotateCw size={15} aria-hidden="true" />Tap to see the meaning.</p>
                </div>
                <div className="fc-face fc-back" inert={!flipped}>
                  <div className="fc-back-head">
                    <div>
                      <p className="fc-back-word">{w.word}</p>
                      <p className="fc-back-pos">{w.pos}</p>
                    </div>
                    {canSpeak && (
                      <button type="button" className="btn-small" onClick={(e) => { e.stopPropagation(); speak(w.word); }}>
                        <Volume2 size={18} aria-hidden="true" />Listen
                      </button>
                    )}
                  </div>
                  <p className="fc-def">{w.def}</p>
                  <p className="fc-ex">&ldquo;{w.ex}&rdquo;</p>
                  <div>
                    <p className="fc-label">Collocations</p>
                    <div className="fc-cols">
                      {w.col.split(/,\s*/).map((c) => <span key={c}>{c}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="fc-actions">
              {flipped ? (
                <div className="fc-rates">
                  {RATES.map(({ s, key }) => (
                    <button
                      key={s}
                      type="button"
                      className="fc-rate"
                      data-prev={progress[w.word] === s ? s : undefined}
                      onClick={() => rate(s)}
                    >
                      <span className={`dot fc-dot-${s}`} aria-hidden="true" />
                      {STATUS_LABEL[s]}
                      <kbd>{key}</kbd>
                    </button>
                  ))}
                </div>
              ) : (
                <button type="button" className="fc-show" onClick={() => setFlipped(true)}>
                  Show meaning<kbd>Space</kbd>
                </button>
              )}
            </div>
          </>
        )}

        {deck && !active && (
          <div className="fc-end">
            <h1 className="sr-only">Flashcards</h1>
            <button type="button" className="fc-close fc-end-close" onClick={() => setDeck(null)} aria-label="Close">
              <X size={22} aria-hidden="true" />
            </button>
            <div>
              <p className="fc-end-head">Round complete · {deck.length} {deck.length === 1 ? "card" : "cards"}</p>
              <p className="fc-score">
                <span className="fc-score-n">{tally.k}</span>
                <span className="fc-score-of">/ {deck.length} known</span>
              </p>
              <p className="fc-summary">You knew {tally.k}, were unsure of {tally.u} and didn&apos;t know {tally.d}.</p>
            </div>
            <div>
              <div className="bar fc-end-bar" aria-hidden="true">
                <span style={{ width: pct(tally.k), background: "var(--know)" }} />
                <span style={{ width: pct(tally.u), background: "var(--unsure)" }} />
                <span style={{ width: pct(tally.d), background: "var(--dont)" }} />
              </div>
              <ul className="legend">
                <li><i className="dot" style={{ background: "var(--know)" }} />{tally.k} know</li>
                <li><i className="dot" style={{ background: "var(--unsure)" }} />{tally.u} unsure</li>
                <li><i className="dot" style={{ background: "var(--dont)" }} />{tally.d} don&apos;t know</li>
              </ul>
            </div>
            <div className="fc-end-actions">
              {missed.length > 0 && (
                <button type="button" className="btn" onClick={() => start(missed.map((m) => m.w))}>
                  Review the {missed.length} I missed
                </button>
              )}
              <button type="button" className={missed.length > 0 ? "btn ghost" : "btn"} onClick={() => start(deck)}>
                Study the same cards again
              </button>
            </div>
            {missed.length > 0 && (
              <div>
                <h2 className="fc-review-head">To review</h2>
                <ul className="fc-review">
                  {missed.map(({ w: m, r }) => (
                    <li key={m.word}>
                      <span className={`status-dot s-${r}`} aria-hidden="true" />
                      <span className="word-row-name"><b>{m.word}</b><i>{m.pos}</i></span>
                      <span className={`fc-review-status fc-c-${r}`}>{STATUS_LABEL[r]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
