"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { optimizeImage } from "../utils/optimizeImage";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  slug: string;
  date: string;
  author: {
    name: string;
    email: string;
  };
  category: {
    name: string;
    slug: string;
  };
  optimizedImage?: string;
}

interface BlogListProps {
  limit?: number;
  showLoadMore?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  limit = 6,
  showLoadMore = false,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(limit);

  const truncateContent = (content: string, limit: number = 150) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + "...";
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");
      const data = await response.json();

      if (data.success) {
        const dataWithOptimizedImages = data.blogs.map((blog: Blog) => ({
          ...blog,
          optimizedImage: optimizeImage(blog.image) || "/blog/asset1.jpg",
        }));
        setBlogs(dataWithOptimizedImages);
      } else {
        setError("An error occurred while loading blogs");
      }
    } catch (error) {
      console.error("Blog fetch error:", error);
      setError("An error occurred while loading blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + limit);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(limit)].map((_, index) => (
          <div
            key={index}
            className="bg-white relative group rounded-xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="overflow-hidden">
              <div className="w-full h-64 lg:h-96 bg-gray-300"></div>
              <div className="absolute top-4 left-4">
                <div className="bg-gray-400 h-6 w-20 rounded-full"></div>
              </div>
            </div>
            <div className="p-6 absolute bottom-0 bg-gradient-to-t from-black/90 to-white/0 w-full">
              <div className="h-6 bg-gray-400 rounded mb-3 w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded w-full"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                <div className="h-4 bg-gray-400 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchBlogs}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const displayedBlogs = blogs.slice(0, displayCount);

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blog posts found yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedBlogs.map((blog) => (
          <Card
            key={blog._id}
            onClick={() => (window.location.href = `/blog/${blog.slug}`)}
            className="bg-white relative group rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-0">
              <div className="overflow-hidden ">
                <Image
                  width={1920}
                  height={1080}
                  src={blog.optimizedImage || "/blog/asset1.jpg"}
                  alt={blog.title}
                  className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {blog.category?.name || "Uncategorized"}
                  </span>
                </div>
              </div>

              <div className="p-6 absolute bottom-0 bg-gradient-to-t from-black/90 to-white/0 w-full text-white">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 transition-colors">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>

                <p className=" mb-4 line-clamp-3">
                  {truncateContent(blog.content.replace(/[#*`_\[\]]/g, ""))}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && displayCount < blogs.length && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Load More ({blogs.length - displayCount} remaining)
          </button>
        </div>
      )}

      {/* View All Button */}
      {!showLoadMore && blogs.length > limit && (
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            View All Blogs ({blogs.length} posts)
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogList;
