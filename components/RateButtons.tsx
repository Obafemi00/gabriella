"use client";
import type { Status } from "@/lib/progress";

export default function RateButtons({ onRate }: { onRate: (s: Status) => void }) {
  return (
    <div className="rate">
      <button type="button" className="rate-k" onClick={() => onRate("k")}>Know <kbd>1</kbd></button>
      <button type="button" className="rate-u" onClick={() => onRate("u")}>Unsure <kbd>2</kbd></button>
      <button type="button" className="rate-d" onClick={() => onRate("d")}>Don&apos;t know <kbd>3</kbd></button>
    </div>
  );
}
