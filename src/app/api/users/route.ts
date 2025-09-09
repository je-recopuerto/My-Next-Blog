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

// Kullanıcıları listele
export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ 
            success: false, 
            message: "Yetkisiz erişim" 
        }, { status: 401 });
    }

    try {
        await ConnectDB();
        
        // Kullanıcının user:manage yetkisi var mı kontrol et
        const currentUser = await UserModel.findOne({ email: session.user?.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "Bu işlem için yetkiniz yok" 
            }, { status: 403 });
        }
        
        const users = await UserModel.find({}).sort({ createdAt: -1 });
        
        // Şifre bilgisini güvenlik açısından gizle, sadece varlığını belirt
        const safeUsers = users.map(user => ({
          ...user.toObject(),
          password: user.password ? "***" : null // Şifre varsa *** göster
        }));
        
        return NextResponse.json({ 
            success: true, 
            users: safeUsers
        });
    } catch (error) {
        console.error("Users fetch error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Kullanıcılar yüklenirken hata oluştu" 
        }, { status: 500 });
    }
}

// Kullanıcı rolü güncelle
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ 
            success: false, 
            message: "Yetkisiz erişim" 
        }, { status: 401 });
    }

    try {
        await ConnectDB();
        
        // Kullanıcının user:manage yetkisi var mı kontrol et
        const currentUser = await UserModel.findOne({ email: session.user?.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "Bu işlem için yetkiniz yok" 
            }, { status: 403 });
        }

        const { userId, role, isActive } = await request.json();
        
        // Owner rolündeki kullanıcının rolü değiştirilemez
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
            message: "Kullanıcı başarıyla güncellendi",
            user: updatedUser
        });
    } catch (error) {
        console.error("User update error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Kullanıcı güncellenirken hata oluştu" 
        }, { status: 500 });
    }
}

// POST - Yeni kullanıcı ekleme
export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ 
                success: false, 
                message: "Giriş yapmanız gerekli" 
            }, { status: 401 });
        }
        
        // Rate limiting
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitResult = rateLimit(`user-create-${clientIP}`, 3, 60000); // 3 attempts per minute
        
        if (!rateLimitResult.success) {
            return NextResponse.json({ 
                success: false, 
                message: "Çok fazla istek. Lütfen bekleyin." 
            }, { status: 429 });
        }
        
        const currentUser = await UserModel.findOne({ email: session.user.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "Bu işlem için yetkiniz yok" 
            }, { status: 403 });
        }

        const { name, email, password, role } = await request.json();
        
        // Input validation ve sanitization
        if (!validateName(name)) {
            return NextResponse.json({ 
                success: false, 
                message: "İsim 2-50 karakter arasında olmalıdır" 
            }, { status: 400 });
        }
        
        if (!validateEmail(email)) {
            return NextResponse.json({ 
                success: false, 
                message: "Geçerli bir email adresi giriniz" 
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
                message: "Geçerli bir rol seçiniz" 
            }, { status: 400 });
        }
        
        // Sanitize inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = email.toLowerCase().trim();
        
        // Email kontrolü
        const existingUser = await UserModel.findOne({ email: sanitizedEmail });
        if (existingUser) {
            return NextResponse.json({ 
                success: false, 
                message: "Bu email adresi zaten kullanılıyor" 
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
            message: "Kullanıcı başarıyla eklendi",
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
            message: "Kullanıcı eklenirken hata oluştu" 
        }, { status: 500 });
    }
}

// DELETE - Kullanıcı silme
export async function DELETE(request: Request) {
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ 
                success: false, 
                message: "Giriş yapmanız gerekli" 
            }, { status: 401 });
        }
        
        const currentUser = await UserModel.findOne({ email: session.user.email });
        if (!currentUser?.permissions.includes("user:manage")) {
            return NextResponse.json({ 
                success: false, 
                message: "Bu işlem için yetkiniz yok" 
            }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "User ID gerekli" 
            }, { status: 400 });
        }

        // Owner rolündeki kullanıcı silinemez
        const targetUser = await UserModel.findById(userId);
        if (targetUser?.role === "Owner") {
            return NextResponse.json({ 
                success: false, 
                message: "Owner rolündeki kullanıcı silinemez" 
            }, { status: 403 });
        }

        // Kendi hesabını silme kontrolü
        if (targetUser?.email === session.user.email) {
            return NextResponse.json({ 
                success: false, 
                message: "Kendi hesabınızı silemezsiniz" 
            }, { status: 403 });
        }

        await UserModel.findByIdAndDelete(userId);
        
        return NextResponse.json({ 
            success: true, 
            message: "Kullanıcı başarıyla silindi"
        });
    } catch (error) {
        console.error("User deletion error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Kullanıcı silinirken hata oluştu" 
        }, { status: 500 });
    }
}
