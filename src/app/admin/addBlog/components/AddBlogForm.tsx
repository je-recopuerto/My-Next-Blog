"use client";
import { FaSave, FaTimes, FaMagic } from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import { useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  content: string;
}

type FormDataType = {
  title: string;
  content: string;
  category: string;
  summary: string;
};

interface AddBlogFormProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  imagePreview: string;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  categories: Category[];
  categoriesLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const AddBlogForm: React.FC<AddBlogFormProps> = ({
  formData,
  setFormData,
  image,
  setImage,
  imagePreview,
  setImagePreview,
  loading,
  categories,
  categoriesLoading,
  handleSubmit,
  handleInputChange,
}) => {
  const [aiLoading, setAiLoading] = useState(false);

  const generateContent = async () => {
    console.log("formData ==> ", formData);
    
    if (!formData.title || !formData.category) {
      alert('Please select title and category first!');
      return;
    }

    // Category ID'sini category adına çevir
    const selectedCategory = categories.find(cat => cat._id === formData.category);
    const categoryName = selectedCategory ? selectedCategory.name : formData.category;

    console.log("Selected category:", selectedCategory);
    console.log("Category name:", categoryName);
  
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          category: categoryName,
          summary: formData.summary,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          content: data.content
        }));
        alert('Content created successfully!');
      } else {
        alert(data.message || 'Error occurred while creating content');
      }
    } catch (error) {
      console.error('AI Content Generation Error:', error);
      alert('Error occurred while creating content');
    } finally {
      setAiLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              {categoriesLoading ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  Loading categories...
                </div>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Summary *
              </label>
              <input
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type blog summary..."
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <ImageUpload
              image={image}
              setImage={setImage}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Blog Content *
            </label>
            <button
              type="button"
              onClick={generateContent}
              disabled={aiLoading || !formData.title || !formData.category}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <FaMagic className="w-4 h-4" />
              {aiLoading ? 'AI Creating...' : 'Use AI for Content'}
            </button>
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write blog content here... (Markdown supported) or use AI to generate content"
            required
          />
          {aiLoading && (
            <div className="mt-2 text-sm text-purple-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              AI is generating content based on your title, category, and summary...
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => (window.location.href = "/admin/blogList")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FaTimes className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="w-4 h-4" />
            {loading ? "Saving..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogForm;
