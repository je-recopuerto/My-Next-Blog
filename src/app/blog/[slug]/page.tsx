import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import MainLayout from "../../components/MainLayout";
import BlogImage from "./components/BlogImage";
import Link from "next/link";
import type { Metadata } from "next";

interface BlogParams {
  params: Promise<{ slug: string }>;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image: string;
  date: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

async function getBlogPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/blog/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.success ? data.blog : null;
  } catch (error) {
    console.error("Blog fetch error:", error);
    return null;
  }
}

// Dynamic Metadata Generation
export async function generateMetadata({ params }: BlogParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  return {
    title: `${post.title} | Emirhan's Blog`,
    description: post.summary || post.content.slice(0, 160) + "...",
    keywords: [
      post.category.name,
      "blog",
      "technology",
      "software",
      "Emirhan",
      ...post.title.split(" ").slice(0, 5)
    ],
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.summary || post.content.slice(0, 160) + "...",
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      authors: [post.author.name],
      section: post.category.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || post.content.slice(0, 160) + "...",
      images: [post.image],
      creator: "@emrhngngr", // Twitter handle'ınızı buraya ekleyin
    },
    other: {
      "article:author": post.author.name,
      "article:section": post.category.name,
      "article:published_time": post.date,
      // Schema.org Article structured data
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.summary || post.content.slice(0, 160) + "...",
        "image": post.image,
        "author": {
          "@type": "Person",
          "name": post.author.name,
          "email": post.author.email
        },
        "publisher": {
          "@type": "Person",
          "name": "Emirhan Güngör",
          "url": siteUrl
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${siteUrl}/blog/${post.slug}`
        },
        "articleSection": post.category.name,
        "wordCount": post.content.split(" ").length,
        "url": `${siteUrl}/blog/${post.slug}`
      })
    }
  };
}

export default async function BlogDetailPage({ params }: BlogParams) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return notFound();

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">›</span>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">›</span>
              <span className="font-medium text-gray-900">{post.title}</span>
            </li>
          </ol>
        </nav>

        <BlogImage
          src={post.image}
          alt={post.title}
          className="w-full object-cover rounded-lg mb-6"
        />
        
        {/* Article Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              {post.category?.name}
            </span>
            <time 
              dateTime={post.date}
              className="text-gray-500 text-sm"
            >
              {new Date(post.date).toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>By {post.author.name}</span>
            <span>•</span>
            <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
          </div>
        </header>
        <div className="prose prose-lg max-w-none mb-6">
          <ReactMarkdown
            components={{
              h1: (props) => (
                <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 border-b-2 border-gray-200 pb-3" {...props} />
              ),
              h2: (props) => (
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-6 border-l-4 border-blue-500 pl-4" {...props} />
              ),
              h3: (props) => (
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 mt-5" {...props} />
              ),
              h4: (props) => (
                <h4 className="text-xl font-medium text-gray-700 mb-2 mt-4" {...props} />
              ),
              p: (props) => (
                <p className="text-gray-700 leading-relaxed mb-4 text-lg" {...props} />
              ),
              a: (props) => (
                <a
                  className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: (props) => (
                <ul className="list-none space-y-2 mb-6 pl-4" {...props} />
              ),
              ol: (props) => (
                <ol className="list-decimal list-inside space-y-2 mb-6 pl-4" {...props} />
              ),
              li: (props) => (
                <li className="relative text-gray-700 pl-6 before:content-['•'] before:absolute before:left-0 before:text-blue-500 before:font-bold" {...props} />
              ),
              img: (props) => (
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                <img className="w-full rounded-xl shadow-lg my-6 hover:shadow-xl transition-shadow duration-300" {...props} />
              ),
              blockquote: (props) => (
                <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 my-6 italic text-gray-700 rounded-r-lg" {...props} />
              ),
              code: (props) => (
                <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono" {...props} />
              ),
              pre: (props) => (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 shadow-lg" {...props} />
              ),
              table: (props) => (
                <table className="w-full border-collapse border border-gray-300 my-6 shadow-sm rounded-lg overflow-hidden" {...props} />
              ),
              th: (props) => (
                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold" {...props} />
              ),
              td: (props) => (
                <td className="border border-gray-300 px-4 py-2" {...props} />
              ),
              hr: (props) => (
                <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          <p>
            <strong>Yayın Tarihi:</strong>{" "}
            {new Date(post.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Kategori:</strong> {post.category.name}
          </p>
          <p>
            <strong>Yazar:</strong> {post.author.name}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
