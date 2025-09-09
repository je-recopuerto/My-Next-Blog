"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

interface BlogItemProps {
  searchTerm?: string;
  selectedCategory?: string;
}

const BlogItem = ({ searchTerm = "", selectedCategory = "" }: BlogItemProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  interface Blog {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
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
    image: string;
    date: string;
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on search term and selected category
  useEffect(() => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((blog) =>
        blog.category.slug === selectedCategory
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  const optimizeImageUrl = (url: string) => {
    if (!url) return "";

    // Cloudinary URL'sine daha yüksek kalite ve genişlik parametreleri ekle
    const optimizedUrl = url.replace(
      "/upload/",
      "/upload/w_800,h_400,q_80,f_auto,e_sharpen/"
    );

    return optimizedUrl;
  };
  return (
    <>
      {filteredBlogs.length === 0 && (searchTerm || selectedCategory) ? (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        filteredBlogs.map((item, idx) => (
          <div
            onClick={() =>
              (window.location.href = item.slug ? `/blog/${item.slug}` : "#")
            }
            key={idx}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <Image
              width={400}
              height={200}
              src={optimizeImageUrl(item.image) || "/blog/asset1.jpg"}
              alt={item.title || "Blog image"}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="px-4 pt-4 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {item.category?.name || "Uncategorized"}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 tracking-tight line-clamp-3 h-16 overflow-hidden text-sm">
                {item.summary}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                <span className="flex items-center gap-2">
                  <Image
                    width={30}
                    height={30}
                    src={item.author?.avatar || "/default-avatar.png"}
                    alt={item.author?.name || "Author"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {item.author?.name || "Author"}
                </span>
                <span>| {new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default BlogItem;
