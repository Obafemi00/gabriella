"use client";
import { useSyncExternalStore } from "react";

export type Status = "k" | "u" | "d";
export type Progress = Record<string, Status>;

const KEY = "gabriella:progress:v1";
const EMPTY: Progress = {};
let state: Progress = EMPTY;
let loaded = false;
let listening = false;
const listeners = new Set<() => void>();

function read() {
  try {
    state = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    state = {};
  }
}
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  read();
  if (!listening) {
    listening = true;
    // Keep several open tabs in step.
    window.addEventListener("storage", (e) => {
      if (e.key === KEY) { read(); emit(); }
    });
  }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function emit() { listeners.forEach((l) => l()); }
function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => { listeners.delete(l); };
}
function getSnapshot() { load(); return state; }

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
export function setStatus(word: string, s: Status | null) {
  load();
  const next = { ...state };
  if (s) next[word] = s; else delete next[word];
  state = next;
  persist();
  emit();
}
export function resetProgress() {
  state = {};
  persist();
  emit();
}
