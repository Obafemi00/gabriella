import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Speaking from "@/components/Speaking";
import { SPEAKING_ENABLED } from "@/lib/features";

export const metadata: Metadata = { title: "Speaking" };

export default function Page() {
  if (!SPEAKING_ENABLED) notFound();
  return (
    <>
      <h1 className="page-title">Speaking</h1>
      <p className="lead">Practise Speaking Part 2 with real timing.</p>
      <Speaking />
    </>
  );
}
