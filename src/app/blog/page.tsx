import React from "react";
import {Commissioner} from "next/font/google";
import BlogItem from "./components/BlogItem";
const commissioner = Commissioner({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});
const BlogPage = () => {
  return (
    <>
      <div className="flex flex-col py-10  gap-4">
        <h2 className={`${commissioner.className} text-5xl`}>Blog</h2>
        <h5> My latest bla bla</h5>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-8">
        <BlogItem />
      </div>
    </>
  );
};

export default BlogPage;
