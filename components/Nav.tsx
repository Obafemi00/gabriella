"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut, useAuthEmail } from "@/lib/supabase/use-auth-email";
import { SPEAKING_ENABLED, WRITING_ENABLED } from "@/lib/features";

const LINKS = ([
  ["/words", "Words", true],
  ["/flashcards", "Flashcards", true],
  ["/quiz", "Quiz", true],
  ["/speaking", "Speaking", SPEAKING_ENABLED],
  ["/writing", "Writing", WRITING_ENABLED],
] as const).filter(([, , enabled]) => enabled);
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/update-password"];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();
  const email = useAuthEmail();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const current = LINKS.find(([href]) => href === path)?.[1];

  // Come back to this page after signing in, unless it's Home or an auth page.
  const signInHref = path === "/" || AUTH_PAGES.includes(path) ? "/login" : `/login?next=${encodeURIComponent(path)}`;
  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.refresh();
  }

  // Close whenever the route actually changes.
  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // Claim the key so page-level Escape handlers (e.g. closing a word) leave it alone.
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    // Capture phase, so this runs before page handlers also listening on document.
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey, true);
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
        {email === null && (
          <Link href={signInHref} className="nav-pill header-signin" aria-current={path === "/login" ? "page" : undefined}>
            Sign in
          </Link>
        )}
        {email && (
          <div className="header-account">
            <span className="header-email" title={email}>{email}</span>
            <button type="button" className="nav-pill header-signout" onClick={handleSignOut}>Sign out</button>
          </div>
        )}
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
        {email && (
          <div className="menu-account">
            <span className="menu-email" title={email}>{email}</span>
            <button type="button" className="btn-small" onClick={handleSignOut}>Sign out</button>
          </div>
        )}
      </nav>
    </header>
  );
}
