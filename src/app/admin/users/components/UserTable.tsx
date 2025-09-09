"use client";
import { FaCrown, FaPen, FaUser, FaToggleOn, FaToggleOff, FaGithub, FaKey, FaBan, FaEdit, FaTrash } from "react-icons/fa";

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

interface UserTableProps {
  users: User[];
  onUpdateUser: (userId: string, role: string, isActive: boolean) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserTable = ({ users, onUpdateUser, onEditUser, onDeleteUser }: UserTableProps) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner": return <FaCrown className="text-yellow-500" />;
      case "Writer": return <FaPen className="text-blue-500" />;
      case "Member": return <FaUser className="text-gray-500" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Writer": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Member": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAuthMethodIcon = (user: User) => {
    const hasGithub = !!user.githubId;
    const hasPassword = !!user.password;
    
    if (hasGithub && hasPassword) {
      return (
        <div className="flex items-center gap-1">
          <FaGithub className="text-gray-600" />
          <span className="text-gray-400">+</span>
          <FaKey className="text-blue-600" />
        </div>
      );
    } else if (hasGithub) {
      return <FaGithub className="text-gray-600" />;
    } else if (hasPassword) {
      return <FaKey className="text-blue-600" />;
    } else {
      return <FaBan className="text-red-500" />;
    }
  };

  const getAuthMethodText = (user: User) => {
    const hasGithub = !!user.githubId;
    const hasPassword = !!user.password;
    
    if (hasGithub && hasPassword) {
      return "GitHub + Şifre";
    } else if (hasGithub) {
      return "Sadece GitHub";
    } else if (hasPassword) {
      return "Sadece Şifre";
    } else {
      return "Yetki Yok";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Kayıtlı Kullanıcılar</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giriş Yöntemi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kayıt Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Giriş
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getAuthMethodIcon(user)}
                    <span className="text-sm text-gray-700">{getAuthMethodText(user)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role !== "Owner" ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateUser(user._id, e.target.value, user.isActive)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Member">Member</option>
                        <option value="Writer">Writer</option>
                        <option value="Owner">Owner</option>
                      </select>
                      
                      <button
                        onClick={() => onUpdateUser(user._id, user.role, !user.isActive)}
                        className={`px-2 py-1 text-sm rounded ${
                          user.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } transition-colors`}
                      >
                        {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                      </button>

                      <button
                        onClick={() => onEditUser(user)}
                        className="px-2 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => onDeleteUser(user)}
                        className="px-2 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Owner hesabı değiştirilemez</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
