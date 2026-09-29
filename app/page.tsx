import Link from "next/link";
import ProgressSummary from "@/components/ProgressSummary";
import { WORDS, GROUPS } from "@/lib/words";

const TOOLS = [
  ["/words", "Words", "Browse every word by topic and mark what you know."],
  ["/flashcards", "Flashcards", "Turn cards over, rate yourself, and review the ones you missed."],
  ["/quiz", "Quiz", "Ten quick questions: definitions and gap-fill sentences."],
  ["/speaking", "Speaking", "Part 2 cue cards with a one-minute preparation timer and two-minute talk timer."],
  ["/writing", "Writing", "Task 2 questions with a 40-minute timer and a live word count."],
] as const;

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Build your IELTS vocabulary, one topic at a time.</h1>
        <p className="lead">
          {WORDS.length} words and phrases across {GROUPS.length} topics that come up often in IELTS Writing and Speaking,
          each with an example sentence and the words it is usually used with.
        </p>
        <div className="toolbar">
          <Link href="/words" className="btn">Start with the words</Link>
          <Link href="/quiz" className="btn ghost">Take a quiz</Link>
        </div>
      </section>

      <section className="home-progress">
        <h2>Your progress</h2>
        <ProgressSummary />
      </section>

      <section>
        <h2 className="sr-only">Practice tools</h2>
        <ul className="tools">
          {TOOLS.map(([href, name, desc]) => (
            <li key={href}>
              <Link href={href} className="tool">
                <span className="tool-name">{name}</span>
                <span className="tool-desc">{desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
