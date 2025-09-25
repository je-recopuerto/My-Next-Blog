"use client";
import { FaTrash } from "react-icons/fa";

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

interface DeleteBlogModalProps {
  isOpen: boolean;
  blog: Blog | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteBlogModal: React.FC<DeleteBlogModalProps> = ({ isOpen, blog, onClose, onConfirm }) => {
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Blog Post
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete the blog post titled &quot;<strong>{blog.title}</strong>&quot;? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FaTrash className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBlogModal;