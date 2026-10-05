import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthForm";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = { title: "Set a new password" };

export default function Page() {
  return (
    <AuthShell title="Set a new password" lead="Choose a password of at least 8 characters.">
      <UpdatePasswordForm />
    </AuthShell>
  );
}
