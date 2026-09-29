import type { Metadata } from "next";
import Flashcards from "@/components/Flashcards";

export const metadata: Metadata = { title: "Flashcards" };

export default function Page() {
  return (
    <>
      <h1 className="page-title">Flashcards</h1>
      <p className="lead">Pick a topic, turn each card over and be honest with yourself.</p>
      <Flashcards />
    </>
  );
}
