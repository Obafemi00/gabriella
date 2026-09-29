"use client";
import { useEffect, useState } from "react";
import type { Status } from "./progress";

export type Filter = "all" | "notknown" | "k" | "u" | "d" | "none";

export function passes(s: Status | undefined, f: Filter) {
  if (f === "all") return true;
  if (f === "notknown") return s !== "k";
  if (f === "none") return !s;
  return s === f;
}
export function shuffle<T>(a: readonly T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
export function pick<T>(a: readonly T[], n: number): T[] { return shuffle(a).slice(0, n); }
export function escapeRegExp(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
export function formatTime(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
export function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
}

export function useCanSpeak() {
  const [ok, setOk] = useState(false);
  useEffect(() => { setOk("speechSynthesis" in window); }, []);
  return ok;
}
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  const v = window.speechSynthesis.getVoices().find((v) => v.lang === "en-GB");
  if (v) u.voice = v;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export const STATUS_LABEL: Record<Status, string> = { k: "Know", u: "Unsure", d: "Don't know" };
