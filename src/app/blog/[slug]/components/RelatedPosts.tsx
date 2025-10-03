import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
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
  };
}

interface RelatedPostsProps {
  currentSlug: string;
}

async function getRelatedPosts(slug: string): Promise<RelatedBlog[]> {
  try {
    let baseUrl: string;
    
    if (process.env.NODE_ENV === 'development') {
      baseUrl = "http://localhost:3000";
    } else {
      baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    }
    
    const apiUrl = `${baseUrl}/api/blog/${encodeURIComponent(slug)}/related`;
    
    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch related posts: ${response.status}`);
      return [];
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid response format for related posts");
      return [];
    }

    const data = await response.json();
    return data.success ? data.blogs : [];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

const RelatedPosts: React.FC<RelatedPostsProps> = async ({ currentSlug }) => {
  const relatedPosts = await getRelatedPosts(currentSlug);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">More Articles</h2>
        <p className="text-gray-600">Discover more insights and stories</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {relatedPosts.map((post) => (
          <Link 
            key={post._id} 
            href={`/blog/${post.slug}`}
            className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {post.category.name}
                </span>
                <time 
                  dateTime={post.date}
                  className="text-gray-500 text-xs"
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {post.summary || post.title}
              </p>
              
              <div className="flex items-center text-xs text-gray-500">
                <span>By {post.author.name}</span>
                <span className="mx-2">•</span>
                <span>{Math.ceil((post.summary || post.title).split(' ').length / 200)} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;