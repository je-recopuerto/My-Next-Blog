import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/config/db";
import UserModel from "../../../../lib/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from 'bcrypt';
import { validateEmail, validatePassword, validateName, validateRole, sanitizeInput } from "../../../../lib/utils/validation";
import { rateLimit } from "../../../../lib/utils/rateLimit";

// DB connection helper
const dbConnect = ConnectDB;

// List users
export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ 
            success: false, 
            message: "Unauthorized access" 
        }, { status: 401 });
    }

    try {
        await ConnectDB();
        
        // Check if user has user:manage permission
        const currentUser = await UserModel.findOne({ email: session.user?.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "You don't have permission for this operation" 
            }, { status: 403 });
        }
        
        const users = await UserModel.find({}).sort({ createdAt: -1 });
        
        // Hide password information for security, only indicate existence
        const safeUsers = users.map(user => ({
          ...user.toObject(),
          password: user.password ? "***" : null // Show *** if password exists
        }));
        
        return NextResponse.json({ 
            success: true, 
            users: safeUsers
        });
    } catch (error) {
        console.error("Users fetch error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Error occurred while loading users" 
        }, { status: 500 });
    }
}

// Update user role
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ 
            success: false, 
            message: "Unauthorized access" 
        }, { status: 401 });
    }

    try {
        await ConnectDB();
        
        // Check if user has user:manage permission
        const currentUser = await UserModel.findOne({ email: session.user?.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "You don't have permission for this operation" 
            }, { status: 403 });
        }

        const { userId, role, isActive } = await request.json();
        
        // User with Owner role cannot be changed
        const targetUser = await UserModel.findById(userId);
        if (targetUser?.role === "Owner") {
            return NextResponse.json({ 
                success: false, 
                message: "Owner role cannot be changed" 
            }, { status: 403 });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            { role, isActive },
            { new: true }
        );
        
        return NextResponse.json({ 
            success: true, 
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("User update error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Error occurred while updating user" 
        }, { status: 500 });
    }
}

// POST - Add new user
export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ 
                success: false, 
                message: "You need to log in" 
            }, { status: 401 });
        }
        
        // Rate limiting
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitResult = rateLimit(`user-create-${clientIP}`, 3, 60000); // 3 attempts per minute
        
        if (!rateLimitResult.success) {
            return NextResponse.json({ 
                success: false, 
                message: "Too many requests. Please wait." 
            }, { status: 429 });
        }
        
        const currentUser = await UserModel.findOne({ email: session.user.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "You don't have permission for this operation" 
            }, { status: 403 });
        }

        const { name, email, password, role } = await request.json();
        
        // Input validation and sanitization
        if (!validateName(name)) {
            return NextResponse.json({ 
                success: false, 
                message: "Name must be between 2-50 characters" 
            }, { status: 400 });
        }
        
        if (!validateEmail(email)) {
            return NextResponse.json({ 
                success: false, 
                message: "Please enter a valid email address" 
            }, { status: 400 });
        }
        
        if (password) {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                return NextResponse.json({ 
                    success: false, 
                    message: passwordValidation.message 
                }, { status: 400 });
            }
        }
        
        if (!validateRole(role)) {
            return NextResponse.json({ 
                success: false, 
                message: "Please select a valid role" 
            }, { status: 400 });
        }
        
        // Sanitize inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = email.toLowerCase().trim();
        
        // Email check
        const existingUser = await UserModel.findOne({ email: sanitizedEmail });
        if (existingUser) {
            return NextResponse.json({ 
                success: false, 
                message: "This email address is already in use" 
            }, { status: 400 });
        }

        // Password hash
        const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined; // 12 rounds for better security

        const newUser = new UserModel({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            role: role || "Member",
            isActive: true,
            permissions: role === "Owner" ? ["blog:create", "blog:edit", "blog:delete", "user:manage", "admin:access"] :
                        role === "Writer" ? ["blog:create", "blog:edit", "admin:access"] :
                        ["admin:access"]
        });

        await newUser.save();
        
        return NextResponse.json({ 
            success: true, 
            message: "User added successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isActive: newUser.isActive,
                authMethod: newUser.password ? "Email" : "GitHub",
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Error occurred while adding user" 
        }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ 
                success: false, 
                message: "You need to log in" 
            }, { status: 401 });
        }
        
        const currentUser = await UserModel.findOne({ email: session.user.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "You don't have permission for this operation" 
            }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "User ID is required" 
            }, { status: 400 });
        }

        // Users with Owner role cannot be deleted
        const targetUser = await UserModel.findById(userId);
        if (targetUser?.role === "Owner") {
            return NextResponse.json({ 
                success: false, 
                message: "Users with Owner role cannot be deleted" 
            }, { status: 403 });
        }

        // Check for deleting own account
        if (targetUser?.email === session.user.email) {
            return NextResponse.json({ 
                success: false, 
                message: "You cannot delete your own account" 
            }, { status: 403 });
        }

        await UserModel.findByIdAndDelete(userId);
        
        return NextResponse.json({ 
            success: true, 
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("User deletion error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Error occurred while deleting user" 
        }, { status: 500 });
    }
}
