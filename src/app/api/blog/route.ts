import { NextResponse } from "next/server"
import { ConnectDB } from "../../../../lib/config/db"
import BlogModel from "../../../../lib/models/BlogModel"
import UserModel from "../../../../lib/models/UserModel"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CategoryModel from "../../../../lib/models/CategoryModel"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import cloudinary from '../../../../lib/config/cloudinary';

export async function GET() {
    try {
        await ConnectDB();
        
        // Ensure models are loaded
        // Models are imported to ensure they're registered with Mongoose
        
        const blogs = await BlogModel.find({})
        .populate('author', 'name email avatar')
        .populate('category', 'name slug')
        .sort({ date: -1 });
        
        return NextResponse.json({ 
            success: true, 
            blogs: blogs,
            count: blogs.length 
        });
    } catch (error) {
        console.error("Blog fetch error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Blog verilerini getirirken hata oluştu" 
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
        return NextResponse.json({ 
            success: false, 
            message: "Yetkisiz erişim" 
        }, { status: 401 })
    }

    try {
        await ConnectDB();
        
        // Blog oluşturma yetkisi kontrolü
        const user = await UserModel.findOne({ email: session.user.email });
        if (!user?.permissions?.includes("blog:create")) {
            return NextResponse.json({ 
                success: false, 
                message: "Blog oluşturma yetkiniz yok" 
            }, { status: 403 })
        }
        
        const formData = await request.formData()
        const image = formData.get("image") as File;
        let imgUrl = "";
        if (image) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'blog-images' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            // @ts-expect-error Cloudinary response type issue
            imgUrl = uploadResult.secure_url;
        }
        console.log("session.user ==> ", session.user);
        // author alanı artık ObjectId olmalı
        // author: formData.get("author") yerine, oturumdaki kullanıcının _id'si alınmalı
        const authorUser = await UserModel.findOne({ email: session.user.email });
        const blogData = {
            title: formData.get("title"),
            slug: formData.get("title")?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
            summary: formData.get("content")?.toString().slice(0, 120) || '',
            content: formData.get("content"),
            category: formData.get("category"),
            author: authorUser?._id, // ObjectId
            image: imgUrl,
            authorImg: session.user.image,
        }

        await BlogModel.create(blogData);
        console.log("Blog created");
        
        console.log(formData)
        return NextResponse.json({ success:true, message: "Blog POST request successful"})
    } catch (error) {
        console.error("Blog creation error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Blog oluşturulurken hata oluştu" 
        }, { status: 500 });
    }
}
