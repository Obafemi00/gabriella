import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Gabriella | IELTS vocabulary practice", template: "%s | Gabriella" },
  description: "Learn IELTS vocabulary with a searchable word list, flashcards, quizzes, and speaking and writing practice.",
};
export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400;1,7..72,500&display=swap"
        />
      </head>
      <body>
        <Nav />
        <main className="wrap main">{children}</main>
        <footer className="footer">
          <div className="wrap footer-inner">
            <p><span className="footer-brand">Gabriella.</span> Your progress is saved in this browser.</p>
            <p>IELTS is a registered trademark jointly owned by the British Council, IDP IELTS and Cambridge University Press &amp; Assessment. This site is not affiliated with them.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
