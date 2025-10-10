import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { pt } from "./ui/fonts";
import AuthSessionProvider from "./components/SessionProvider";


export const metadata: Metadata = {
  title: {
    default: "Emirhan's Blog - Software, Technology & Personal Insights",
    template: "%s | Emirhan's Blog"
  },
  description: "Personal blog by Emirhan Güngör about software development, technology trends, programming tutorials, and tech insights. Built with Next.js.",
  keywords: [
    "blog", "software", "technology", "programming", "web development", 
    "Next.js", "React", "JavaScript", "TypeScript", "Emirhan Güngör",
    "tech blog", "coding", "tutorials", "software engineering"
  ],
  authors: [{ name: "Emirhan Güngör", url: "https://emrhngngr.tech" }],
  creator: "Emirhan Güngör",
  publisher: "Emirhan Güngör",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    title: "Emirhan's Blog - Software, Technology & Personal Insights",
    description: "Personal blog by Emirhan Güngör about software development, technology trends, programming tutorials, and tech insights.",
    siteName: "Emirhan's Blog",
    images: [
      {
        url: "/blog/asset2.jpg",
        width: 1200,
        height: 630,
        alt: "Emirhan's Blog"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Emirhan's Blog - Software, Technology & Personal Insights",
    description: "Personal blog by Emirhan Güngör about software development, technology trends, programming tutorials, and tech insights.",
    creator: "@emrhngngr", // Twitter handle'ınızı güncelleyin
    images: ["/blog/asset2.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Emirhan's Blog",
      "description": "Personal blog about software development, technology trends, programming tutorials, and tech insights.",
      "url": process.env.NEXTAUTH_URL || "http://localhost:3000",
      "author": {
        "@type": "Person",
        "name": "Emirhan Güngör",
        "url": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "sameAs": [
          "https://github.com/emrhngngr",
          "https://linkedin.com/in/emirhanguengoer" // LinkedIn profilinizi ekleyin
        ]
      },
      "publisher": {
        "@type": "Person",
        "name": "Emirhan Güngör"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <body
        className={`${pt.className}`}
      >
        <AuthSessionProvider>
          {children}
          <SpeedInsights />
          <Analytics />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
