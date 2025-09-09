import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import MainLayout from "../../components/MainLayout";
import Image from "next/image";

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
  const optimizeImageUrl = (url: string) => {
    if (!url) return "";

    // Cloudinary URL'sine daha yüksek kalite ve genişlik parametreleri ekle
    const optimizedUrl = url.replace(
      "/upload/",
      "/upload/w_800,h_400,q_80,f_auto,e_sharpen/"
    );

    return optimizedUrl;
  };

export default async function BlogDetailPage({ params }: BlogParams) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return notFound();

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        <Image
          width={800}
          height={400}
          src={optimizeImageUrl(post.image) || "/blog/asset1.jpg"}
          alt={post.title}
          className="w-full object-cover rounded-lg mb-6"
          unoptimized
        />
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="prose prose-lg max-w-none mb-6">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 border-b-2 border-gray-200 pb-3" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-6 border-l-4 border-blue-500 pl-4" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 mt-5" {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4 className="text-xl font-medium text-gray-700 mb-2 mt-4" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700 leading-relaxed mb-4 text-lg" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-none space-y-2 mb-6 pl-4" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 mb-6 pl-4" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="relative text-gray-700 pl-6 before:content-['•'] before:absolute before:left-0 before:text-blue-500 before:font-bold" {...props} />
              ),
              img: ({ node, ...props }) => (
                <img className="w-full rounded-xl shadow-lg my-6 hover:shadow-xl transition-shadow duration-300" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 my-6 italic text-gray-700 rounded-r-lg" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 shadow-lg" {...props} />
              ),
              table: ({ node, ...props }) => (
                <table className="w-full border-collapse border border-gray-300 my-6 shadow-sm rounded-lg overflow-hidden" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-gray-300 px-4 py-2" {...props} />
              ),
              hr: ({ node, ...props }) => (
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
