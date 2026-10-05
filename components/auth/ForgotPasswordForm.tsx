"use client";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { authMessage } from "@/lib/auth-errors";
import { Field, FormMessage } from "./AuthForm";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/confirm?next=/update-password`,
      });
      // Only rate limits and connection problems are shown. Anything else gets the same
      // reply as success, so the page never reveals which emails have an account.
      if (error && (error.status === 429 || error.name === "AuthRetryableFetchError")) setError(authMessage(error));
      else setSent(true);
    } catch {
      setError(authMessage(null));
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <FormMessage kind="success">
        If there&apos;s an account for <b>{email.trim()}</b>, we&apos;ve sent a link to reset the password. Check your inbox.
      </FormMessage>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
      <button type="submit" className="btn" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
    </form>
  );
}
