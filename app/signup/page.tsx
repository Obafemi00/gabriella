import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthForm";
import SignupForm from "@/components/auth/SignupForm";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Create an account" };

type Search = Promise<{ next?: string | string[] }>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null);
  const loginHref = next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`;
  return (
    <AuthShell
      title="Create an account"
      lead="Use your email and a password of at least 8 characters."
      footer={<>Already have an account? <Link href={loginHref}>Sign in</Link></>}
    >
      <SignupForm next={next} />
    </AuthShell>
  );
}
