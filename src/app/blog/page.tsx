import React from "react";
import {Commissioner} from "next/font/google";
import BlogItem from "./components/BlogItem";
import MainLayout from "../components/MainLayout";

const commissioner = Commissioner({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const BlogPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col py-10 gap-4">
        <h2 className={`${commissioner.className} text-5xl`}>Blog</h2>
        <h5>En Son Makaleler</h5>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <BlogItem />
      </div>
    </MainLayout>
  );
};

export default BlogPage;
