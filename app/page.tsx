import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import ProgressSummary from "@/components/ProgressSummary";
import { WORDS } from "@/lib/words";

const TOOLS = [
  ["/words", "Words", "Search the full word list and mark what you know."],
  ["/flashcards", "Flashcards", "Turn cards over, rate yourself, and review the ones you missed."],
  ["/quiz", "Quiz", "Ten quick questions: definitions and gap-fill sentences."],
  ["/speaking", "Speaking", "Part 2 cue cards with a one-minute preparation timer and two-minute talk timer."],
  ["/writing", "Writing", "Task 2 questions with a 40-minute timer and a live word count."],
] as const;

export default function Home() {
  return (
    <>
      <section className="hero-grid">
        <div className="hero">
          <h1>Build your IELTS vocabulary, one word at a time.</h1>
          <p className="lead">
            {WORDS.length} words and phrases that come up often in IELTS Writing and
            Speaking, each with an example sentence and the words it is usually used with.
          </p>
          <div className="toolbar">
            <Link href="/words" className="btn">
              Start with the words
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/quiz" className="btn ghost">Take a quiz</Link>
          </div>
        </div>

        <div className="home-progress panel-soft">
          <h2>Your progress</h2>
          <ProgressSummary />
        </div>
      </section>

      <section>
        <h2 className="sr-only">Practice tools</h2>
        <ul className="tools">
          {TOOLS.map(([href, name, desc], i) => (
            <li key={href}>
              <Link href={href} className="tool">
                <span className="tool-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="tool-body">
                  <span className="tool-name">{name}</span>
                  <span className="tool-desc">{desc}</span>
                </span>
                <ChevronRight size={18} aria-hidden="true" className="tool-chevron" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
