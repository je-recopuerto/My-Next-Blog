"use client";
import { FaSave, FaTimes } from "react-icons/fa";
import ImageUpload from "./ImageUpload";

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write blog content here... (Markdown supported)"
            required
          />
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
