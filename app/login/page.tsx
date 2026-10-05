import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthForm";
import LoginForm from "@/components/auth/LoginForm";
import { LINK_ERROR } from "@/lib/auth-errors";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Sign in" };

type Search = Promise<{ next?: string | string[]; error?: string | string[] }>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null);
  const signupHref = next === "/" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`;
  return (
    <AuthShell
      title="Sign in"
      lead="Welcome back. You can use every page without an account."
      footer={<>New here? <Link href={signupHref}>Create an account</Link></>}
    >
      <LoginForm next={next} initialError={sp.error === "link" ? LINK_ERROR : undefined} />
    </AuthShell>
  );
}
