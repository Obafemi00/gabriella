"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { authMessage, LINK_ERROR } from "@/lib/auth-errors";
import { Field, FormMessage } from "./AuthForm";

const MIN = 8;

export default function UpdatePasswordForm() {
  // The invite or reset link signs the learner in before they land here.
  const [state, setState] = useState<"checking" | "ready" | "no-session" | "done">("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      createClient().auth.getUser()
        .then(({ data }) => setState(data.user ? "ready" : "no-session"))
        .catch(() => setState("no-session"));
    } catch {
      setState("no-session");
    }
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < MIN) { setError(`Use at least ${MIN} characters for your password.`); return; }
    setBusy(true); setError("");
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) setError(authMessage(error));
      else setState("done");
    } catch {
      setError(authMessage(null));
    }
    setBusy(false);
  }

  if (state === "checking") return <p className="note">Checking your link…</p>;
  if (state === "no-session") {
    return (
      <>
        <FormMessage kind="error">{LINK_ERROR}</FormMessage>
        <p className="auth-aside"><Link href="/forgot-password">Request a new link</Link></p>
      </>
    );
  }
  if (state === "done") {
    return (
      <>
        <FormMessage kind="success">Your password is set. You&apos;re signed in.</FormMessage>
        <Link href="/" className="btn">Go to Home</Link>
      </>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <Field
        label="New password" name="password" type="password" autoComplete="new-password"
        value={password} onChange={setPassword} minLength={MIN} hint={`At least ${MIN} characters.`}
      />
      <button type="submit" className="btn" disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
    </form>
  );
}
