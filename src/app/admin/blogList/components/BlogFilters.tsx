"use client";
import { FaSearch } from "react-icons/fa";

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

interface BlogFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  blogs: Blog[];
  filteredBlogs: Blog[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  getUniqueCategories: () => string[];
}

const BlogFilters: React.FC<BlogFiltersProps> = ({
  searchTerm,
  selectedCategory,
  blogs,
  filteredBlogs,
  onSearchChange,
  onCategoryChange,
  getUniqueCategories,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs (title, description, author)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map((category) =>
              (() => {
                if (
                  typeof category === "string" &&
                  category.includes("|")
                ) {
                  const [id, name] = category.split("|");
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                } else {
                  return (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  );
                }
              })()
            )}
          </select>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        Total {blogs.length} blogs - Showing {filteredBlogs.length}{" "}
        blogs
      </div>
    </div>
  );
};

export default BlogFilters;