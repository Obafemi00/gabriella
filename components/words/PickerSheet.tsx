"use client";
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

export type PickerOption<T extends string> = { value: T; label: string; count?: number };

// Mobile bottom sheet for the Show and Order choices.
export default function PickerSheet<T extends string>({ title, open, options, value, onPick, onClose }: {
  title: string;
  open: boolean;
  options: PickerOption<T>[];
  value: T;
  onPick: (v: T) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog word-sheet"
      aria-label={title}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      {open && (
        <div className="dialog-body">
          <div className="sheet-handle" aria-hidden="true" />
          <h2 className="picker-title">{title}</h2>
          <div className="picker-list" role="group" aria-label={title}>
            {options.map((o) => (
              <button key={o.value} type="button" className="picker-opt" aria-pressed={o.value === value} onClick={() => onPick(o.value)}>
                <span className="picker-opt-label">{o.label}</span>
                {o.count !== undefined && <span className="picker-opt-n">{o.count}</span>}
                <Check size={18} className="picker-opt-check" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
