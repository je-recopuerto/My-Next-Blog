"use client";
import { useState, useEffect } from "react";
import UserTable from "./components/UserTable";
import AddUserModal from "./components/AddUserModal";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import RolePermissionsInfo from "./components/RolePermissionsInfo";
import { FaUsers, FaPlus } from "react-icons/fa";

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

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
        handleCloseAddModal();
        alert("Kullanıcı başarıyla eklendi!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Kullanıcı eklenirken hata oluştu");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
        handleCloseDeleteModal();
        alert("Kullanıcı başarıyla silindi!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Kullanıcı silinirken hata oluştu");
    }
  };

  const updateUser = async (userId: string, role: string, isActive: boolean) => {
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role, isActive }),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({ name: "", email: "", password: "", role: "Member" });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", password: "", role: "Member" });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      updateUser(selectedUser._id, formData.role, selectedUser.isActive);
      handleCloseEditModal();
    }
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser._id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 ml-64 p-8">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <FaUsers className="text-3xl text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                Kullanıcı Ekle
              </button>
            </div>
            <p className="text-gray-600">Sistem kullanıcılarını ve rollerini yönetin</p>
          </div>

          {/* Users Table */}
          <UserTable 
            users={users}
            onUpdateUser={updateUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />

          {/* Modals */}
          <AddUserModal 
            isOpen={showAddModal}
            formData={formData}
            onFormChange={setFormData}
            onClose={handleCloseAddModal}
            onSubmit={createUser}
          />

          <EditUserModal 
            isOpen={showEditModal}
            user={selectedUser}
            formData={formData}
            onFormChange={setFormData}
            onClose={handleCloseEditModal}
            onSubmit={handleUpdateUser}
          />

          <DeleteUserModal 
            isOpen={showDeleteModal}
            user={selectedUser}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
          />

          {/* Role Permissions Info */}
          <RolePermissionsInfo />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
