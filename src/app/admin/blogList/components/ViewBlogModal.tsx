"use client";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string | { _id: string; name: string; slug?: string };
  author:
    | string
    | { _id: string; name: string; email?: string; avatar?: string };
  image: string;
  date: string;
}

interface ViewBlogModalProps {
  isOpen: boolean;
  blog: Blog | null;
  onClose: () => void;
}

const ViewBlogModal: React.FC<ViewBlogModalProps> = ({ isOpen, blog, onClose }) => {
  if (!blog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Blog Preview
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {typeof blog.category === "object" &&
              blog.category !== null
                ? blog.category.name
                : blog.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="mr-4">
              👤{" "}
              {typeof blog.author === "object" &&
              blog.author !== null
                ? blog.author.name
                : blog.author}
            </span>
            <span>
              {new Date(blog.date).toLocaleDateString("en-US")}
            </span>
          </div>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-4xl font-bold text-gray-900 mb-6 mt-8 border-b-2 border-gray-200 pb-3"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-3xl font-semibold text-gray-800 mb-4 mt-6 border-l-4 border-blue-500 pl-4"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-2xl font-semibold text-gray-800 mb-3 mt-5"
                    {...props}
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h4
                    className="text-xl font-medium text-gray-700 mb-2 mt-4"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p
                    className="text-gray-700 leading-relaxed mb-4 text-lg"
                    {...props}
                  />
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
                  <ul
                    className="list-none space-y-2 mb-6 pl-4"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-inside space-y-2 mb-6 pl-4"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li
                    className="relative text-gray-700 pl-6 before:content-['•'] before:absolute before:left-0 before:text-blue-500 before:font-bold"
                    {...props}
                  />
                ),
                img: ({ node, ...props }) => (
                  <img
                    className="w-full rounded-xl shadow-lg my-6 hover:shadow-xl transition-shadow duration-300"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-blue-500 bg-blue-50 p-4 my-6 italic text-gray-700 rounded-r-lg"
                    {...props}
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono"
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 shadow-lg"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <table
                    className="w-full border-collapse border border-gray-300 my-6 shadow-sm rounded-lg overflow-hidden"
                    {...props}
                  />
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="border border-gray-300 px-4 py-2"
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr
                    className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                    {...props}
                  />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBlogModal;