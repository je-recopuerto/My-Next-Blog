"use client";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

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

interface BlogTableProps {
  blogs: Blog[];
  onView: (blog: Blog) => void;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}

const BlogTable: React.FC<BlogTableProps> = ({ blogs, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blog
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr
                key={blog._id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Blog Information */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 mr-4">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {blog.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-xs mt-1">
                        {blog.content.length > 60
                          ? blog.content.substring(0, 60) + "..."
                          : blog.content}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {typeof blog.category === "object" &&
                    blog.category !== null
                      ? blog.category.name
                      : blog.category}
                  </span>
                </td>

                {/* Author */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">👤</span>
                    {typeof blog.author === "object" &&
                    blog.author !== null
                      ? blog.author.name
                      : blog.author}
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>
                      {new Date(blog.date).toLocaleDateString("en-US")}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(blog.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {/* View */}
                    <button
                      onClick={() => onView(blog)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      title="View"
                    >
                      <FaEye className="w-3 h-3 mr-1" />
                      View
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(blog)}
                      className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      title="Edit"
                    >
                      <FaEdit className="w-3 h-3 mr-1" />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(blog)}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (can be added in the future) */}
      <div className="bg-white px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Total{" "}
            <span className="font-medium">{blogs.length}</span>{" "}
            blogs showing
          </div>
          <div className="text-sm text-gray-500">
            {blogs.length} total blogs
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTable;