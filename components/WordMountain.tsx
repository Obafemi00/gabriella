"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleCheck, Info, Search, SearchX, X } from "lucide-react";
import { WORDS, LAST_GROUP, wordsInGroup, type Word } from "@/lib/words";
import { useDays, setDayStatus, startNextDay, resetProgress, type Status, type Progress } from "@/lib/progress";
import { shuffle, isTyping, STATUS_LABEL } from "@/lib/utils";
import WordDialog from "./WordDialog";
import WordDetailPanel, { type WordContext } from "./WordDetailPanel";
import RidgeMap from "./words/RidgeMap";
import PickerSheet from "./words/PickerSheet";
import { useIsDesktop } from "./words/useIsDesktop";

type Show = "all" | "unmarked" | "k" | "u" | "d" | "dky";
type Order = "in" | "grp" | "all";

const SHOWS: { value: Show; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unmarked", label: "Not marked today" },
  { value: "k", label: "Know" },
  { value: "u", label: "Unsure" },
  { value: "d", label: "Don't know" },
  { value: "dky", label: "Don't know yesterday" },
];
const ORDERS: { value: Order; label: string }[] = [
  { value: "in", label: "In order" },
  { value: "grp", label: "Shuffle within groups" },
  { value: "all", label: "Shuffle everything" },
];
const RANK: Record<Status, number> = { k: 2, u: 1, d: 0 };

type Section = { key: string; group: number | null; name: string; meta: string; words: Word[] };

export default function WordMountain() {
  const { current: currentDay, days } = useDays();
  const isDesktop = useIsDesktop();

  // The day being looked at. null follows the current (latest) day.
  const [viewDay, setViewDay] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<Show>("all");
  const [order, setOrder] = useState<Order>("in");
  // Bumped when a shuffle is chosen (again), so it reshuffles.
  const [seed, setSeed] = useState(0);
  const [showY, setShowY] = useState(true);
  const [introClosed, setIntroClosed] = useState(false);
  // Mobile only: which groups are open. Groups not listed use the default.
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [menu, setMenu] = useState<"show" | "order" | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const day = Math.min(viewDay ?? currentDay, currentDay);
  const today: Progress = days[day] ?? {};
  const yest: Progress | null = day > 1 ? days[day - 1] ?? {} : null;
  const groups = Math.min(day, LAST_GROUP);
  const newGroup = day <= LAST_GROUP ? day : null;

  const open = useMemo(() => WORDS.filter((w) => w.group <= groups), [groups]);
  const total = open.length;
  const count = (s: Status) => open.filter((w) => today[w.word] === s).length;
  const kn = count("k"), un = count("u"), dk = count("d");
  const marked = kn + un + dk;
  let up = 0, down = 0;
  if (yest) {
    for (const w of open) {
      const t = today[w.word], y = yest[w.word];
      if (t && y) { if (RANK[t] > RANK[y]) up++; else if (RANK[t] < RANK[y]) down++; }
    }
  }

  const q = query.trim().toLowerCase();
  const passShow = (w: Word, f: Show) => {
    const t = today[w.word];
    if (f === "all") return true;
    if (f === "unmarked") return !t;
    if (f === "dky") return yest?.[w.word] === "d";
    return t === f;
  };
  const matches = (w: Word) => passShow(w, show) && (!q || w.word.toLowerCase().includes(q) || w.def.toLowerCase().includes(q));
  const filtering = show !== "all" || !!q;

  // Shuffles happen when chosen, never on first render, so server and client agree.
  const rank = useMemo(() => {
    const r = new Map<string, number>();
    if (order !== "in") shuffle(WORDS).forEach((w, i) => r.set(w.word, i));
    return r;
  }, [order, seed]);
  const byRank = (ws: Word[]) => (order === "in" ? ws : [...ws].sort((a, b) => rank.get(a.word)! - rank.get(b.word)!));

  const sections: Section[] = [];
  if (order === "all") {
    const ws = byRank(open.filter(matches));
    if (ws.length) sections.push({ key: "all", group: null, name: "All groups", meta: `${ws.length} words · shuffled`, words: ws });
  } else {
    for (let g = groups; g >= 1; g--) {
      const all = wordsInGroup(g);
      const ws = byRank(all.filter(matches));
      if (filtering && !ws.length) continue;
      sections.push({ key: `g${g}`, group: g, name: `Group ${g}`, meta: `${all.length} words · ${all.filter((w) => today[w.word]).length} marked`, words: ws });
    }
  }
  const flat = sections.flatMap((s) => s.words);
  // Mobile only; on desktop CSS shows every group's list.
  const isOpen = (g: number | null) => g === null || (expanded[g] ?? (filtering || g === (newGroup ?? groups)));

  const current = selected ? WORDS.find((w) => w.word === selected) ?? null : null;

  function goToDay(n: number) {
    setViewDay(n >= currentDay ? null : n);
    setSelected(null);
    setExpanded({});
  }
  function startDay() {
    startNextDay();
    setViewDay(null);
    setSelected(null);
    setExpanded({});
    setIntroClosed(true);
    setShow("all");
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function next(from: Word) {
    const i = flat.findIndex((x) => x.word === from.word);
    setSelected(flat[i + 1]?.word ?? null);
  }
  function mark(s: Status) {
    if (!current) return;
    const w = current;
    next(w);
    setDayStatus(day, w.word, s);
  }
  function clearCurrent() {
    if (current) setDayStatus(day, current.word, null);
  }
  function goToGroup(g: number) {
    if (!isDesktop) {
      const only: Record<number, boolean> = {};
      for (let k = 1; k <= groups; k++) only[k] = k === g;
      setExpanded(only);
    }
    requestAnimationFrame(() => document.getElementById(`group-${g}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function beginFirst() {
    setIntroClosed(true);
    const first = wordsInGroup(groups).find((w) => !today[w.word]) ?? wordsInGroup(groups)[0];
    if (first) setSelected(first.word);
  }
  function reset() {
    if (!confirm("Clear every Know, Unsure and Don't know mark on every day, and go back to Day 1? This cannot be undone.")) return;
    resetProgress();
    setViewDay(null);
    setSelected(null);
    setExpanded({});
    setIntroClosed(false);
  }

  // Keyboard shortcuts (1/2/3 mark+advance, ArrowRight advance, Escape close) work whether the word is
  // showing in the mobile bottom sheet or the desktop pane, so they're wired at document
  // level. Refs keep the handler reading the latest mark/next/current without re-binding
  // the listener on every render.
  const markRef = useRef(mark);
  const nextRef = useRef(next);
  const currentRef = useRef(current);
  markRef.current = mark;
  nextRef.current = next;
  currentRef.current = current;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || isTyping(e)) return;
      const w = currentRef.current;
      if (!w) return;
      if (e.key === "Escape") {
        setSelected(null);
        return;
      }
      const m = ({ "1": "k", "2": "u", "3": "d" } as const)[e.key as "1" | "2" | "3"];
      if (m) {
        e.preventDefault();
        markRef.current(m);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextRef.current(w);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const intro = !introClosed && currentDay === 1 && day === 1 && marked === 0;
  const complete = total > 0 && marked === total && day === currentDay;
  const note = day < currentDay
    ? `You're looking back at Day ${day}. Changes here update that day's marks.`
    : day > LAST_GROUP
      ? `Every group is open, so Day ${day} reviews ${LAST_GROUP === 1 ? "Group 1" : `Groups 1 to ${LAST_GROUP}`}.`
      : "";
  const startLabel = `Start Day ${currentDay + 1}`;
  const pct = (n: number) => `${total ? (n / total) * 100 : 0}%`;
  const showCounts = SHOWS.map((s) => ({ ...s, count: open.filter((w) => passShow(w, s.value)).length }));
  const groupsText = groups === 1 ? "Group 1" : `Groups 1 to ${groups}`;
  const showLabel = SHOWS.find((s) => s.value === show)!.label;
  const emptyText = q && show !== "all"
    ? `Nothing under “${showLabel}” contains “${query.trim()}”.`
    : q
      ? `No word in ${groupsText} contains “${query.trim()}”. Check the spelling or try part of the word.`
      : show === "unmarked"
        ? "Every word is marked today."
        : `No words are marked “${showLabel}” ${show === "dky" ? "for yesterday" : "today"}.`;

  function pickShow(v: Show) { setShow(v); setMenu(null); }
  function pickOrder(v: Order) {
    if (v !== "in") setSeed((n) => n + 1);
    setOrder(v);
    setMenu(null);
  }

  const context: WordContext | null = current && {
    groupLabel: `Group ${current.group} · ${current.group === newGroup ? "New" : "Review"}`,
    dayLabel: day === currentDay ? `Today, Day ${day}` : `Day ${day}`,
    yesterday: yest?.[current.word],
    yesterdayNote: day === 1 || current.group === day ? "New today" : "Yesterday: not marked",
  };

  const startButton = (cls: string) => (
    <button type="button" className={`btn ghost day-start ${cls}`} onClick={startDay}>
      {startLabel}<ArrowRight size={16} aria-hidden="true" />
    </button>
  );

  return (
    <div className="mtn">
      <div className="mtn-side">
        <div className="day-row">
          <button type="button" className="day-step" aria-label="Previous day" disabled={day <= 1} onClick={() => goToDay(day - 1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <h2 className="day-label" aria-live="polite">Day {day}</h2>
          <button type="button" className="day-step" aria-label="Next day" disabled={day >= currentDay} onClick={() => goToDay(day + 1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          {marked > 0 && startButton("day-start-inline")}
        </div>

        <div className="day-progress">
          <div className="day-progress-head">
            <span>Day {day} · {marked} of {total} words marked</span>
            <span className="day-progress-pct">{total ? Math.round((marked / total) * 100) : 0}%</span>
          </div>
          <div className="bar" aria-hidden="true">
            <span style={{ width: pct(kn), background: "var(--know)" }} />
            <span style={{ width: pct(un), background: "var(--unsure)" }} />
            <span style={{ width: pct(dk), background: "var(--dont)" }} />
          </div>
        </div>
        {marked > 0 && startButton("day-start-block")}

        <label className="words-search">
          <span className="sr-only">Search words</span>
          <Search size={18} className="words-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button type="button" className="words-search-clear" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </label>

        {/* Mobile: two buttons that open bottom sheets. Desktop: the lists below. */}
        <div className="picker-btns">
          <button type="button" className="picker-btn" aria-haspopup="dialog" onClick={() => setMenu("show")}>
            <span className="picker-btn-k">Show</span>
            <span className="picker-btn-v">{showLabel}</span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>
          <button type="button" className="picker-btn" aria-haspopup="dialog" onClick={() => setMenu("order")}>
            <span className="picker-btn-k">Order</span>
            <span className="picker-btn-v">{ORDERS.find((o) => o.value === order)!.label}</span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="side-list" role="group" aria-labelledby="side-show">
          <p id="side-show" className="side-list-label">Show</p>
          {showCounts.map((s) => (
            <button key={s.value} type="button" className="side-opt" aria-pressed={show === s.value} onClick={() => pickShow(s.value)}>
              {s.label}<span className="side-opt-n">{s.count}</span>
            </button>
          ))}
        </div>
        <div className="side-list" role="group" aria-labelledby="side-order">
          <p id="side-order" className="side-list-label">Order</p>
          {ORDERS.map((o) => (
            <button key={o.value} type="button" className="side-opt" aria-pressed={order === o.value} onClick={() => pickOrder(o.value)}>
              {o.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          role="switch"
          className="y-switch"
          aria-checked={showY && !!yest}
          disabled={!yest}
          onClick={() => setShowY((v) => !v)}
        >
          <span>Show yesterday&apos;s marks{!yest && <span className="y-switch-hint"> from Day 2</span>}</span>
          <span className="switch" aria-hidden="true" />
        </button>
      </div>

      <div className="mtn-main">
        {intro && (
          <section className="intro" aria-labelledby="intro-title">
            <div>
              <p className="intro-kicker">Welcome to Day 1</p>
              <h2 id="intro-title" className="intro-title">How the mountain works</h2>
            </div>
            <ol className="intro-steps">
              <li>Each day adds a new group of 30 words. Today you have Group 1; tomorrow, Groups 1 and 2.</li>
              <li>Mark every word each day as Know, Unsure or Don&apos;t know. Marks start fresh every day.</li>
              <li>From Day 2, a small dot beside each word shows yesterday&apos;s mark, so you can see what has changed.</li>
            </ol>
            <div className="intro-actions">
              <button type="button" className="btn intro-go" onClick={beginFirst}>Start with Group 1<ArrowRight size={17} aria-hidden="true" /></button>
              <button type="button" className="btn-text" onClick={() => setIntroClosed(true)}>Got it</button>
            </div>
          </section>
        )}

        <RidgeMap
          groups={groups}
          newGroup={newGroup}
          today={today}
          matches={matches}
          current={selected}
          isDesktop={isDesktop}
          onGroup={goToGroup}
          onWord={(w) => setSelected(w.word)}
        />

        {complete && (
          <section className="complete" aria-labelledby="complete-title">
            <h2 id="complete-title" className="complete-title"><CircleCheck size={22} aria-hidden="true" />Day {day} complete</h2>
            <p className="complete-text">
              You marked all {total} words today. {day < LAST_GROUP ? `Day ${day + 1} adds Group ${day + 1}.` : `Day ${day + 1} reviews every group.`}
            </p>
            <ul className="complete-tiles">
              {([["k", kn], ["u", un], ["d", dk]] as const).map(([s, n]) => (
                <li key={s}><b>{n}</b><span><i className={`status-dot s-${s}`} aria-hidden="true" />{STATUS_LABEL[s]}</span></li>
              ))}
            </ul>
            {yest && up + down > 0 && (
              <p className="complete-change">Compared with yesterday: {up} {up === 1 ? "word" : "words"} moved up, {down} moved down.</p>
            )}
            <button type="button" className="btn complete-go" onClick={startDay}>{startLabel}<ArrowRight size={17} aria-hidden="true" /></button>
          </section>
        )}

        {note && <p className="mtn-note"><Info size={16} aria-hidden="true" />{note}</p>}

        <div className="mtn-groups">
          {sections.map((s) => {
            const shown = isOpen(s.group);
            const listId = `${s.key}-words`;
            const isNew = s.group !== null && s.group === newGroup;
            return (
              <section key={s.key} id={s.group ? `group-${s.group}` : undefined} className="mtn-group">
                <h2 className="mtn-group-head">
                  {isDesktop || s.group === null ? (
                    <span className="mtn-group-row">
                      <span className="mtn-group-name">{s.name}</span>
                      {isNew && <span className="tag-new">New</span>}
                      <span className="mtn-group-meta">{s.meta}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="mtn-group-row"
                      aria-expanded={shown}
                      aria-controls={listId}
                      onClick={() => setExpanded((e) => ({ ...e, [s.group!]: !shown }))}
                    >
                      <span className="mtn-group-name">{s.name}</span>
                      {isNew && <span className="tag-new">New</span>}
                      <span className="mtn-group-meta">{s.meta}</span>
                      {shown ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                    </button>
                  )}
                </h2>
                <ul id={listId} className="mtn-words" hidden={!shown}>
                    {s.words.map((w) => {
                      const t = today[w.word];
                      const y = showY && yest ? yest[w.word] : undefined;
                      return (
                        <li key={w.word}>
                          <button type="button" className="mtn-word" aria-current={selected === w.word || undefined} onClick={() => setSelected(w.word)}>
                            <span className={`status-dot y-dot${y ? ` s-${y}` : ""}`} aria-hidden="true" />
                            <span className="word-row-name"><b>{w.word}</b><i>{w.pos}</i></span>
                            <span className={`mark-pill${t ? ` s-${t}` : ""}`}>{t ? STATUS_LABEL[t] : "Not marked"}</span>
                            {y && <span className="sr-only">, yesterday: {STATUS_LABEL[y]}</span>}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </section>
            );
          })}

          {filtering && sections.length === 0 && (
            <div className="no-results" role="status">
              <span className="no-results-icon"><SearchX size={24} aria-hidden="true" /></span>
              <p className="no-results-title">No words match</p>
              <p className="no-results-text">{emptyText}</p>
              <div className="no-results-actions">
                {q && <button type="button" className="btn" onClick={() => setQuery("")}>Clear search</button>}
                {show !== "all" && <button type="button" className={q ? "btn ghost" : "btn"} onClick={() => setShow("all")}>Show all words</button>}
              </div>
            </div>
          )}

          <p className="reset-row">
            <button type="button" className="link" onClick={reset}>Reset all progress</button>
          </p>
        </div>
      </div>

      <aside className="word-pane" aria-label="Word details">
        {current && context ? (
          <WordDetailPanel
            word={current}
            status={today[current.word]}
            context={context}
            onMark={mark}
            onNext={() => next(current)}
            onClear={clearCurrent}
            onDismiss={() => setSelected(null)}
          />
        ) : (
          <p className="word-pane-empty">Choose a word to see its meaning.</p>
        )}
      </aside>

      <WordDialog
        word={current}
        status={current ? today[current.word] : undefined}
        context={context ?? { groupLabel: "", dayLabel: "", yesterdayNote: "" }}
        onClose={() => setSelected(null)}
        onMark={mark}
        onNext={() => current && next(current)}
        onClear={clearCurrent}
      />

      <PickerSheet
        title="Show"
        open={menu === "show"}
        options={showCounts}
        value={show}
        onPick={pickShow}
        onClose={() => setMenu(null)}
      />
      <PickerSheet
        title="Order"
        open={menu === "order"}
        options={ORDERS}
        value={order}
        onPick={pickOrder}
        onClose={() => setMenu(null)}
      />
    </div>
  );
}
