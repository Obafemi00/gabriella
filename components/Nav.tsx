"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  ["/words", "Words"],
  ["/flashcards", "Flashcards"],
  ["/quiz", "Quiz"],
  ["/speaking", "Speaking"],
  ["/writing", "Writing"],
] as const;

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const current = LINKS.find(([href]) => href === path)?.[1];

  // Close whenever the route actually changes.
  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="logo" aria-label="Gabriella home">
          Gabriella<span className="logo-dot" aria-hidden="true" />
        </Link>
        {current && <span className="current-page">{current}</span>}
        <nav className="nav-desktop" aria-label="Main">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="nav-pill" aria-current={path === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <button
          ref={buttonRef}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          Menu
        </button>
      </div>
      <div className="menu-backdrop" hidden={!open} onClick={() => setOpen(false)} aria-hidden="true" />
      <nav id="mobile-menu" ref={panelRef} className="menu-panel" aria-label="Main" hidden={!open}>
        {LINKS.map(([href, label], i) => (
          <Link
            key={href}
            href={href}
            ref={i === 0 ? firstLinkRef : undefined}
            className="menu-link"
            aria-current={path === href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
