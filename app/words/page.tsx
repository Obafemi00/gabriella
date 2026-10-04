import type { Metadata } from "next";
import WordMountain from "@/components/WordMountain";

export const metadata: Metadata = { title: "Words" };

export default function Page() {
  return (
    <>
      <h1 className="page-title">Words</h1>
      <p className="lead">Every word in one list. Search by word or meaning, then click a word to see its meaning, then mark it. Keys 1, 2 and 3 mark a word and move to the next one.</p>
      <WordMountain />
    </>
  );
}
