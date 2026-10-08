import type { Metadata } from "next";
import WordMountain from "@/components/WordMountain";

export const metadata: Metadata = { title: "Words" };

export default function Page() {
  return (
    <div className="words-wide">
      <h1 className="sr-only">Words</h1>
      <WordMountain />
    </div>
  );
}
