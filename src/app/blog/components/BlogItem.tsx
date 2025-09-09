'use client';
import React from "react";
import blogDataItem from "../../../../data/blog_data.json";
import { FaUserCircle } from "react-icons/fa";

const BlogItem = () => {
  // Type assertion to handle the data structure
  const posts = blogDataItem.posts as Array<{
    id: number;
    title: string;
    slug: string;
    summary: string;
    image_url: string;
    published_date: string;
    author_id: number;
  }>;

  return (
    <>
      {posts.map((item, idx) => (
        <div
          onClick={() => window.location.href = item.slug ? `/blog/${item.slug}` : "#"}
          key={idx}
          className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
        >
          <img
            src={item.image_url || "/blog/asset1.jpg"}
            alt={item.title || "Blog görseli"}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="px-4 pt-4 pb-6">
            <h3 className="text-xl font-bold mb-3 line-clamp-2">{item.title}</h3>
            <p className="text-gray-600 tracking-tight line-clamp-3 h-16 overflow-hidden text-sm">{item.summary}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
              <span className="flex items-center gap-2">
              <FaUserCircle className="w-4 h-4" />
                {"Anonim"}</span>
              <span>| {new Date(item.published_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogItem;
