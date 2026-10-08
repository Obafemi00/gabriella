"use client";
import { useSyncExternalStore } from "react";

// All progress storage lives in this file, so it can later move to Supabase without
// touching the pages that use it.

export type Status = "k" | "u" | "d";
/** One mark per word. */
export type Progress = Record<string, Status>;
/** Marks per day (day 1, 2, 3, …) and the latest day the learner has started. */
export type Days = { current: number; days: Record<number, Progress> };

const KEY = "gabriella:progress:v2";
// Before days existed, marks were stored one per word under this key. They are copied into
// Day 1 the first time the new key is missing. The old key is left in place as a backup.
const OLD_KEY = "gabriella:progress:v1";

const EMPTY_DAYS: Days = { current: 1, days: { 1: {} } };
const EMPTY: Progress = {};

let days: Days = EMPTY_DAYS;
let latest: Progress = EMPTY;
let loaded = false;
let listening = false;
const listeners = new Set<() => void>();

const isStatus = (s: unknown): s is Status => s === "k" || s === "u" || s === "d";

function cleanMarks(raw: unknown): Progress {
  const out: Progress = {};
  if (raw && typeof raw === "object") {
    for (const [w, s] of Object.entries(raw)) if (isStatus(s)) out[w] = s;
  }
  return out;
}

function parse(raw: string | null): Days | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const current = Number.isInteger(data.current) && data.current >= 1 ? data.current : 1;
    const out: Record<number, Progress> = {};
    if (data.days && typeof data.days === "object") {
      for (const [d, marks] of Object.entries(data.days)) {
        const n = Number(d);
        if (Number.isInteger(n) && n >= 1 && n <= current) out[n] = cleanMarks(marks);
      }
    }
    return { current, days: out };
  } catch {
    return null;
  }
}

// Each word's most recent mark from any day.
function computeLatest(d: Days): Progress {
  const out: Progress = {};
  for (let n = d.current; n >= 1; n--) {
    const marks = d.days[n];
    if (!marks) continue;
    for (const [w, s] of Object.entries(marks)) if (!(w in out)) out[w] = s;
  }
  return out;
}

function apply(next: Days) {
  days = next;
  latest = computeLatest(next);
}

function read() {
  let stored: string | null = null;
  try { stored = localStorage.getItem(KEY); } catch {}
  const parsed = parse(stored);
  if (parsed) { apply(parsed); return; }
  if (stored === null) {
    // First load with day-based progress: move the old marks into Day 1, once.
    let old: Progress = {};
    try { old = cleanMarks(JSON.parse(localStorage.getItem(OLD_KEY) || "{}")); } catch {}
    apply({ current: 1, days: { 1: old } });
    persist();
    return;
  }
  apply(EMPTY_DAYS);
}
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  read();
  if (!listening) {
    listening = true;
    // Keep several open tabs in step.
    window.addEventListener("storage", (e) => {
      if (e.key === KEY || e.key === null) { read(); emit(); }
    });
  }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ v: 2, ...days })); } catch {}
}
function emit() { listeners.forEach((l) => l()); }
function commit(next: Days) {
  apply(next);
  persist();
  emit();
}
function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** Each word's most recent mark from any day. Used by Flashcards, Quiz, Speaking and Home. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, () => { load(); return latest; }, () => EMPTY);
}
/** Marks for every day, plus the latest day started. Used by the Words page. */
export function useDays(): Days {
  return useSyncExternalStore(subscribe, () => { load(); return days; }, () => EMPTY_DAYS);
}

/** Saves a mark to a given day. `null` clears it. Days after the current one are ignored. */
export function setDayStatus(day: number, word: string, s: Status | null) {
  load();
  if (day < 1 || day > days.current) return;
  const marks = { ...(days.days[day] ?? {}) };
  if (s) marks[word] = s; else delete marks[word];
  commit({ current: days.current, days: { ...days.days, [day]: marks } });
}
/** Saves a mark to the current day (the latest day started). */
export function setStatus(word: string, s: Status | null) {
  load();
  setDayStatus(days.current, word, s);
}
/** Starts the next day with no marks and makes it the current day. */
export function startNextDay() {
  load();
  const n = days.current + 1;
  commit({ current: n, days: { ...days.days, [n]: {} } });
}
/** Clears every day and goes back to Day 1. */
export function resetProgress() {
  load();
  commit(EMPTY_DAYS);
}
