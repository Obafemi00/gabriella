import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset your password" };

export default function Page() {
  return (
    <AuthShell
      title="Reset your password"
      lead="Enter your email and we'll send you a link to set a new password."
      footer={<>Remembered it? <Link href="/login">Sign in</Link></>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
