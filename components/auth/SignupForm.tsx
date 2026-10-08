"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authMessage, signupMessage, MISMATCH } from "@/lib/auth-errors";
import { safeNext } from "@/lib/safe-next";
import { Field, FormMessage } from "./AuthForm";

const MIN = 8;

export default function SignupForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const mismatch = confirmTouched && confirm !== password;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < MIN) { setError(`Use at least ${MIN} characters for your password.`); return; }
    if (confirm !== password) { setConfirmTouched(true); setError(""); return; }
    setBusy(true); setError("");
    try {
      const target = safeNext(next);
      const { data, error } = await createClient().auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(target)}` },
      });
      if (error) { setError(signupMessage(error)); setBusy(false); return; }
      // With email confirmation turned off, Supabase signs the learner in straight away.
      if (data.session) { router.replace(target); router.refresh(); return; }
      setSent(true);
    } catch {
      setError(authMessage(null));
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <FormMessage kind="success">
        Check your inbox. We&apos;ve sent a link to <b>{email.trim()}</b> to confirm your account.
      </FormMessage>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
      <Field
        label="Password" name="password" type="password" autoComplete="new-password"
        value={password} onChange={setPassword} minLength={MIN} hint={`At least ${MIN} characters.`}
      />
      <Field
        label="Confirm password" name="confirm-password" type="password" autoComplete="new-password"
        value={confirm} onChange={(v) => { setConfirm(v); setConfirmTouched(true); }}
        error={mismatch ? MISMATCH : undefined}
      />
      <button type="submit" className="btn" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
    </form>
  );
}
