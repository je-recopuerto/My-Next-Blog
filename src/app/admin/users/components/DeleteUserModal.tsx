"use client";
import { FaTimes } from "react-icons/fa";

interface User {
  _id: string;
  email: string;
  name: string;
  role: "Owner" | "Writer" | "Member";
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
  permissions: string[];
  githubId?: string;
  password?: string;
}

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserModal = ({ isOpen, user, onClose, onConfirm }: DeleteUserModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-600">Kullanıcı Sil</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            <strong>{user.name}</strong> ({user.email}) kullanıcısını silmek istediğinizden emin misiniz?
          </p>
          <p className="text-red-600 text-sm mt-2">
            Bu işlem geri alınamaz!
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Evet, Sil
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
