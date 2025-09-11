import type { Metadata } from "next";
import "./globals.css";
import { pt } from "./ui/fonts";
import AuthSessionProvider from "./components/SessionProvider";


export const metadata: Metadata = {
  title: "Emirhan's Blog",
  description: "Personal blog about software, technology, education, and current topics. Built with Next.js.",
  keywords: ["blog", "software", "technology", "education", "Emirhan", "Next.js", "personal blog"],
  other: {
    "author": "Emirhan Güngör",
    "viewport": "width=device-width, initial-scale=1",
    "robots": "index, follow",
    // Schema.org structured data
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Emirhan's Blog",
      "description": "Personal blog about software, technology, education, and current topics.",
      "url": "https://yourdomain.com"
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${pt.className}`}
      >
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
