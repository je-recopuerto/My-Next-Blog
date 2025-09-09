import { getServerSession } from "next-auth";
import { authOptions } from "../src/app/api/auth/[...nextauth]/route";
import UserModel from "./models/UserModel";
import { ConnectDB } from "./config/db";

export interface UserPermissions {
  canCreateBlog: boolean;
  canEditBlog: boolean;
  canDeleteBlog: boolean;
  canPublishBlog: boolean;
  canManageCategories: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
}

export async function getUserPermissions(email?: string): Promise<UserPermissions> {
  const defaultPermissions: UserPermissions = {
    canCreateBlog: false,
    canEditBlog: false,
    canDeleteBlog: false,
    canPublishBlog: false,
    canManageCategories: false,
    canManageUsers: false,
    canAccessAdmin: false,
  };

  if (!email) return defaultPermissions;

  try {
    await ConnectDB();
    const user = await UserModel.findOne({ email });
    
    if (!user || !user.isActive) return defaultPermissions;

    const permissions = user.permissions || [];

    return {
      canCreateBlog: permissions.includes("blog:create"),
      canEditBlog: permissions.includes("blog:edit"),
      canDeleteBlog: permissions.includes("blog:delete"),
      canPublishBlog: permissions.includes("blog:publish"),
      canManageCategories: permissions.includes("category:create") || permissions.includes("category:edit"),
      canManageUsers: permissions.includes("user:manage"),
      canAccessAdmin: permissions.includes("admin:access"),
    };
  } catch (error) {
    console.error("Permission check error:", error);
    return defaultPermissions;
  }
}

export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return false;

    await ConnectDB();
    const user = await UserModel.findOne({ email: session.user.email });
    
    return user?.isActive && user?.permissions?.includes(permission) || false;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}
