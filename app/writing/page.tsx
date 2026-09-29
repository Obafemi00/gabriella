import type { Metadata } from "next";
import Writing from "@/components/Writing";

export const metadata: Metadata = { title: "Writing" };

export default function Page() {
  return (
    <>
      <h1 className="page-title">Writing</h1>
      <p className="lead">Practise Writing Task 2 with real timing.</p>
      <Writing />
    </>
  );
}
