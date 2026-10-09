import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Writing from "@/components/Writing";
import { WRITING_ENABLED } from "@/lib/features";

export const metadata: Metadata = { title: "Writing" };

export default function Page() {
  if (!WRITING_ENABLED) notFound();
  return (
    <>
      <h1 className="page-title">Writing</h1>
      <p className="lead">Practise Writing Task 2 with real timing.</p>
      <Writing />
    </>
  );
}
