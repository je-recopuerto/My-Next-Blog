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

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: "Owner" | "Writer" | "Member";
}

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  formData: UserFormData;
  onFormChange: (data: UserFormData) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const EditUserModal = ({ isOpen, user, formData, onFormChange, onClose, onSubmit }: EditUserModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Kullanıcı Düzenle</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange({...formData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email adresi değiştirilemez</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Opsiyonel)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => onFormChange({...formData, password: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Boş bırakılırsa değişmez"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              value={formData.role}
              onChange={(e) => onFormChange({...formData, role: e.target.value as "Owner" | "Writer" | "Member"})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Member">Member</option>
              <option value="Writer">Writer</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onSubmit}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Güncelle
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

export default EditUserModal;
