"use client";
import { FaPlus } from "react-icons/fa";

interface EmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, selectedCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
      <div className="text-gray-400 text-6xl mb-4">📝</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchTerm || selectedCategory !== "all"
          ? "No search results found"
          : "No blog posts yet"}
      </h3>
      <p className="text-gray-600 mb-6">
        {searchTerm || selectedCategory !== "all"
          ? "Try again with different search criteria"
          : "Click the new blog button to create your first blog post"}
      </p>
      <button
        onClick={() => (window.location.href = "/admin/addBlog")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
      >
        <FaPlus className="w-4 h-4" />
        Create Your First Blog
      </button>
    </div>
  );
};

export default EmptyState;