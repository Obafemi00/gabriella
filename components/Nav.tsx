"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/words", "Words"],
  ["/flashcards", "Flashcards"],
  ["/quiz", "Quiz"],
  ["/speaking", "Speaking"],
  ["/writing", "Writing"],
] as const;

export default function Nav() {
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="logo" aria-label="Gabriella home">
          Gabriella<span className="logo-dot" aria-hidden="true" />
        </Link>
        <nav className="nav" aria-label="Main">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="nav-link" aria-current={path === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
