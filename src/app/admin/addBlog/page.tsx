"use client";
import { useState, useEffect } from "react";
import AddBlogForm from "./components/AddBlogForm";

interface Category {
  _id: string;
  name: string;
  slug: string;
  content: string;
}

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    summary: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error('Failed to load categories:', data.message);
        // If categories are missing, call the seed endpoint
        await seedCategories();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // If categories are missing, call the seed endpoint
      await seedCategories();
    } finally {
      setCategoriesLoading(false);
    }
  };

  const seedCategories = async () => {
    try {
      const response = await fetch('/api/categories/seed', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Category seed error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      alert("Please select an image!");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("image", image);

      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert("Blog created successfully!");
        // Clear the form
        setFormData({
          title: "",
          content: "",
          category: "",
          summary: "",
        });
        setImage(null);
        setImagePreview("");
        // Redirect to the blog list
        window.location.href = "/admin/blogList";
      } else {
        alert(data.message || "An error occurred while creating the blog!");
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert("An error occurred while creating the blog!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
            <p className="text-gray-600 mt-2">Create a new blog post</p>
          </div>

          <AddBlogForm
            formData={formData}
            setFormData={setFormData}
            image={image}
            setImage={setImage}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            loading={loading}
            categories={categories}
            categoriesLoading={categoriesLoading}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default AddBlogPage;
