import type { ReactNode } from "react";

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
}) {
  const hintId = props.hint ? `${props.name}-hint` : undefined;
  return (
    <label className="auth-field">
      <span className="auth-label">{props.label}</span>
      <input
        name={props.name}
        type={props.type}
        autoComplete={props.autoComplete}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        minLength={props.minLength}
        aria-describedby={hintId}
        required
        spellCheck={false}
        autoCapitalize="none"
      />
      {props.hint && <span id={hintId} className="auth-hint">{props.hint}</span>}
    </label>
  );
}

export function FormMessage({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  return (
    <p className={`auth-msg auth-msg-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}
