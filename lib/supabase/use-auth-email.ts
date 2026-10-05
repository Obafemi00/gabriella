"use client";
import { useEffect, useState } from "react";
import { createClient } from "./client";

// The signed-in learner's email, for display in the header only. Never use this to
// decide what someone may see or change: check on the server with getClaims() for that.
// undefined = still checking, null = signed out.
export function useAuthEmail() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setEmail(null); // Supabase isn't configured: behave as signed out.
      return;
    }
    // Fires straight away with the current session, then on every sign-in and sign-out.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return email;
}

export async function signOut() {
  try {
    await createClient().auth.signOut();
  } catch {
    // Already signed out or offline: the header updates either way on the next load.
  }
}
