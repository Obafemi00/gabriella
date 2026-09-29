import type { Metadata } from "next";
import Speaking from "@/components/Speaking";

export const metadata: Metadata = { title: "Speaking" };

export default function Page() {
  return (
    <>
      <h1 className="page-title">Speaking</h1>
      <p className="lead">Practise Speaking Part 2 with real timing.</p>
      <Speaking />
    </>
  );
}
