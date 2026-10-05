"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authMessage } from "@/lib/auth-errors";
import { safeNext } from "@/lib/safe-next";
import { Field, FormMessage } from "./AuthForm";

export default function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
      if (error) { setError(authMessage(error)); setBusy(false); return; }
      router.replace(safeNext(next));
      router.refresh();
    } catch {
      setError(authMessage(null)); setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
      <p className="auth-aside"><Link href="/forgot-password">Forgot password?</Link></p>
      <button type="submit" className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
