"use client";
import { useSyncExternalStore } from "react";

// Matches the 860px desktop breakpoint in globals.css. False on the server and first render.
const QUERY = "(min-width: 860px)";

function subscribe(l: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", l);
  return () => mq.removeEventListener("change", l);
}

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
