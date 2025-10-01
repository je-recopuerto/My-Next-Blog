"use client";
import { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaTimes, FaSave, FaImage } from "react-icons/fa";
import ImageUpload from "../../addBlog/components/ImageUpload";
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

interface EditForm {
  title: string;
  content: string;
  category: string;
  author: string;
  image?: File | null;
  currentImage?: string;
}

interface EditBlogModalProps {
  isOpen: boolean;
  blog: Blog | null;
  onClose: () => void;
  onSave: (editForm: EditForm) => void;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ isOpen, blog, onClose, onSave }) => {
  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    content: "",
    category: "",
    author: "",
    currentImage: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (blog) {
      setEditForm({
        title: blog.title,
        content: blog.content,
        category:
          typeof blog.category === "object" && blog.category !== null
            ? blog.category._id
            : blog.category,
        author:
          typeof blog.author === "object" && blog.author !== null
            ? blog.author._id
            : blog.author,
        currentImage: blog.image,
      });
      setImagePreview(blog.image); // Mevcut görseli preview olarak göster
      setImage(null); // Yeni görsel seçilmedi
    }
  }, [blog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = {
      ...editForm,
      image: image, // Yeni görsel seçildiyse gönder
    };
    onSave(formDataToSend);
  };

  if (!isOpen || !blog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Blog
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editForm.content}
                onChange={(e) =>
                  setEditForm({ ...editForm, content: e.target.value })
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Image
              </label>
              <ImageUpload
                image={image}
                setImage={setImage}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
              {editForm.currentImage && !image && (
                <p className="text-sm text-gray-500 mt-2">
                  Current image will be kept if no new image is selected
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) =>
                    setEditForm({ ...editForm, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaSave className="w-4 h-4" />
                Save
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogModal;