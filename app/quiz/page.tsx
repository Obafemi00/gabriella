import type { Metadata } from "next";
import Quiz from "@/components/Quiz";

export const metadata: Metadata = { title: "Quiz" };

export default function Page() {
  return (
    <>
      <h1 className="page-title">Quiz</h1>
      <p className="lead">Test yourself on meanings and on using words in context.</p>
      <Quiz />
    </>
  );
}
