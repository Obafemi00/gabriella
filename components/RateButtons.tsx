"use client";
import type { Status } from "@/lib/progress";
import { STATUS_LABEL } from "@/lib/utils";

const KEYS: [Status, string][] = [["k", "1"], ["u", "2"], ["d", "3"]];

export default function RateButtons({ value, onRate }: { value?: Status; onRate: (s: Status) => void }) {
  return (
    <div className="rate" role="group" aria-label="Mark this word">
      {KEYS.map(([s, key]) => (
        <button key={s} type="button" className={`rate-btn rate-${s}`} aria-pressed={value === s} onClick={() => onRate(s)}>
          <span className={`status-dot s-${s}`} aria-hidden="true" />
          {STATUS_LABEL[s]}
          <kbd>{key}</kbd>
        </button>
      ))}
    </div>
  );
}
