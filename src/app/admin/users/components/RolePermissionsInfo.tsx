"use client";
import { FaCrown, FaPen, FaUser } from "react-icons/fa";

const RolePermissionsInfo = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaCrown className="text-2xl text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Owner</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All blog operations</li>
          <li>• Category management</li>
          <li>• User management</li>
          <li>• Admin panel access</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaPen className="text-2xl text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Writer</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Create blogs</li>
          <li>• Edit blogs</li>
          <li>• Publish blogs</li>
          <li>• Admin panel access</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaUser className="text-2xl text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Member</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Read-only access</li>
          <li>• No admin panel access</li>
          <li>• No blog operations</li>
          <li>• No category operations</li>
        </ul>
      </div>
    </div>
  );
};

export default RolePermissionsInfo;
