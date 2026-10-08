"use client";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

// Shared layout for the sign-in, sign-up and password pages.
export function AuthShell({ title, lead, children, footer }: { title: string; lead?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="auth">
      <h1 className="page-title">{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {children}
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
  );
}

export function Field(props: {
  label: string;
  name: string;
  type: "email" | "password";
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  minLength?: number;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [shown, setShown] = useState(false);
  // Caret/selection to put back after the input switches between password and text.
  const restore = useRef<{ start: number | null; end: number | null; focus: boolean } | null>(null);

  useLayoutEffect(() => {
    const input = inputRef.current;
    const r = restore.current;
    if (!input || !r) return;
    restore.current = null;
    if (r.focus) input.focus();
    if (r.start !== null && r.end !== null) input.setSelectionRange(r.start, r.end);
  }, [shown]);

  function toggle() {
    const input = inputRef.current;
    if (input) {
      restore.current = { start: input.selectionStart, end: input.selectionEnd, focus: document.activeElement === input };
    }
    setShown((s) => !s);
  }

  const isPassword = props.type === "password";
  const hintId = props.hint ? `${id}-hint` : undefined;
  const errorId = props.error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">{props.label}</label>
      <div className={isPassword ? "auth-input auth-input-password" : "auth-input"}>
        <input
          ref={inputRef}
          id={id}
          name={props.name}
          type={isPassword && shown ? "text" : props.type}
          autoComplete={props.autoComplete}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          minLength={props.minLength}
          aria-describedby={describedBy}
          aria-invalid={props.error ? true : undefined}
          required
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />
        {isPassword && (
          <button
            type="button"
            className="auth-reveal"
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            aria-controls={id}
            // Keeps focus (and the caret) in the field when the button is clicked or tapped.
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggle}
          >
            {shown ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
          </button>
        )}
      </div>
      {props.hint && <span id={hintId} className="auth-hint">{props.hint}</span>}
      {props.error && <span id={errorId} className="auth-field-error" role="alert">{props.error}</span>}
    </div>
  );
}

export function FormMessage({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  return (
    <p className={`auth-msg auth-msg-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}
