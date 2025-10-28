import React from "react";
import { Commissioner } from "next/font/google";
import MainLayout from "../components/MainLayout";
import BlogFilter from "./components/BlogFilter";
import type { Metadata } from "next";

// Blog sayfası için metadata
export const metadata: Metadata = {
  title: "Blog | All Articles about Technology & Software",
  description: "Browse all articles about software development, programming, web technologies, and tech insights by Emirhan Güngör.",
  keywords: ["blog articles", "programming tutorials", "software development", "web development", "technology articles"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Blog | All Articles about Technology & Software",
    description: "Browse all articles about software development, programming, web technologies, and tech insights by Emirhan Güngör.",
    type: "website",
    url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | All Articles about Technology & Software",
    description: "Browse all articles about software development, programming, web technologies, and tech insights by Emirhan Güngör.",
  },
  alternates: {
    canonical: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog`,
  },
};

const commissioner = Commissioner({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

interface Category {
  _id: string;
  name: string;
  slug: string;
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/categories`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data.success ? data.categories : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function BlogPage() {
  const categories = await getCategories();

  return (
    <MainLayout>
      <div className="flex flex-col py-10 gap-4">
        <h2 className={`${commissioner.className} text-5xl`}>Blog</h2>
        <h5 className="text-gray-600">Latest Articles</h5>
        
        <BlogFilter categories={categories} />
      </div>
    </MainLayout>
  );
}
