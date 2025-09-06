'use client';
import React from "react";
import blogDataItem from "../../../../data/blog_data.json";
import { FaUserCircle } from "react-icons/fa";

const BlogItem = () => {
  return (
    <>
      {blogDataItem.posts.map((item, idx) => (
        <div
          onClick={() => window.location.href = item.slug ? `/blog/${item.slug}` : "#"}
          key={idx}
          className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
        >
          <img
            src={item.image_url || "/blog/asset1.jpg"}
            alt={item.title || "Blog görseli"}
            className="w-full object-cover rounded-t-lg"
          />
          <div className="px-4 pt-4">
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 tracking-tight line-clamp-4 h-24 overflow-hidden">{item.summary}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 my-4">
              <span className="flex items-center gap-2">
              <FaUserCircle className="w-8 h-8" />
                
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
