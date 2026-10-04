import type { Metadata } from "next";
import Flashcards from "@/components/Flashcards";

export const metadata: Metadata = { title: "Flashcards" };

// The heading and intro live inside <Flashcards /> so they can step aside during a round.
export default function Page() {
  return <Flashcards />;
}
