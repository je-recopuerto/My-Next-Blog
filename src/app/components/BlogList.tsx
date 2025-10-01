"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";

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

  const optimizeImageUrl = (url: string) => {
    if (!url) return "";

    // Cloudinary URL'sine optimizasyon parametreleri ekle
    const optimizedUrl = url.replace(
      "/upload/",
      "/upload/w_800,h_800,q_auto:good,f_auto,c_fill/"
    );

    return optimizedUrl;
  };

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
        setBlogs(data.blogs);
      } else {
        setError("Blogları yüklerken bir hata oluştu");
      }
    } catch (error) {
      console.error("Blog fetch error:", error);
      setError("Blogları yüklerken bir hata oluştu");
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
            className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="w-full h-64 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-4 w-5/6"></div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
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
          Tekrar Dene
        </button>
      </div>
    );
  }

  const displayedBlogs = blogs.slice(0, displayCount);

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Henüz blog yazısı bulunmuyor.</p>
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
                  src={optimizeImageUrl(blog.image)}
                  alt={blog.title}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
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
            Daha Fazla Yükle ({blogs.length - displayCount} kaldı)
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
            Tüm Blogları Görüntüle ({blogs.length} yazı)
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogList;
