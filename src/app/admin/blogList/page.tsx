"use client";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import BlogFilters from "./components/BlogFilters";
import BlogTable from "./components/BlogTable";
import ViewBlogModal from "./components/ViewBlogModal";
import EditBlogModal from "./components/EditBlogModal";
import DeleteBlogModal from "./components/DeleteBlogModal";
import EmptyState from "./components/EmptyState";

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

interface EditForm {
  title: string;
  content: string;
  category: string;
  author: string;
  image?: File | null;
  currentImage?: string;
}

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal states
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof blog.author === "object" && blog.author !== null
            ? blog.author.name.toLowerCase().includes(searchTerm.toLowerCase())
            : blog.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => {
        if (typeof blog.category === "object" && blog.category !== null) {
          return (
            blog.category._id === selectedCategory ||
            blog.category.name === selectedCategory
          );
        }
        return blog.category === selectedCategory;
      });
    }

    setFilteredBlogs(filtered);
  };

  // Modal opening functions
  const openViewModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewModal(true);
  };

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditModal(true);
  };

  const openDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteModal(true);
  };

  // Modal closing function
  const closeModals = () => {
    setViewModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedBlog(null);
  };

  // Blog update
  const updateBlog = async (editForm: EditForm) => {
    if (!selectedBlog) return;

    try {
      let response;
      
      // Eğer yeni görsel seçildiyse FormData kullan
      if (editForm.image && editForm.image instanceof File) {
        const formData = new FormData();
        formData.append("title", editForm.title);
        formData.append("content", editForm.content);
        formData.append("category", editForm.category);
        formData.append("author", editForm.author);
        formData.append("image", editForm.image);

        response = await fetch(`/api/blog/${selectedBlog._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Görsel yoksa JSON kullan
        response = await fetch(`/api/blog/${selectedBlog._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editForm.title,
            content: editForm.content,
            category: editForm.category,
            author: editForm.author,
          }),
        });
      }

      const data = await response.json();

      if (data.success) {
        // Update the list
        setBlogs(
          blogs.map((blog) =>
            blog._id === selectedBlog._id ? { ...blog, ...data.blog } : blog
          )
        );
        closeModals();
        alert("Blog updated successfully!");
      } else {
        alert(data.message || "An error occurred while updating the blog!");
      }
    } catch (error) {
      console.error("Blog update error:", error);
      alert("An error occurred while updating the blog!");
    }
  };

  // Blog deletion
  const deleteBlog = async () => {
    if (!selectedBlog) return;

    try {
      const response = await fetch(`/api/blog/${selectedBlog._id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log("data ==> ", data);

      if (data.success) {
        // Update the list
        setBlogs(blogs.filter((blog) => blog._id !== selectedBlog._id));
        closeModals();
        alert("Blog deleted successfully!");
      } else {
        alert(data.message || "An error occurred while deleting the blog!");
      }
    } catch (error) {
      console.error("Blog deletion error:", error);
      alert("An error occurred while deleting the blog!");
    }
  };

  const getUniqueCategories = () => {
    const categories = blogs.map((blog) => {
      if (typeof blog.category === "object" && blog.category !== null) {
        return blog.category._id + "|" + blog.category.name;
      }
      return blog.category;
    });
    return [...new Set(categories)];
  };

  return (
    <>
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blog Posts
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your blog posts
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/admin/addBlog")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              New Blog
            </button>
          </div>

          {/* Filters */}
          <BlogFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            blogs={blogs}
            filteredBlogs={filteredBlogs}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            getUniqueCategories={getUniqueCategories}
          />
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <EmptyState 
            searchTerm={searchTerm} 
            selectedCategory={selectedCategory} 
          />
        ) : (
          <BlogTable
            blogs={filteredBlogs}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </div>

      {/* Modals */}
      <ViewBlogModal
        isOpen={viewModal}
        blog={selectedBlog}
        onClose={closeModals}
      />

      <EditBlogModal
        isOpen={editModal}
        blog={selectedBlog}
        onClose={closeModals}
        onSave={updateBlog}
      />

      <DeleteBlogModal
        isOpen={deleteModal}
        blog={selectedBlog}
        onClose={closeModals}
        onConfirm={deleteBlog}
      />
    </>
  );
};

export default BlogListPage;
