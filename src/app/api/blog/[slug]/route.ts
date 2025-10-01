import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/config/db";
import BlogModel from "../../../../../lib/models/BlogModel";
import UserModel from "../../../../../lib/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import cloudinary from "../../../../../lib/config/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ConnectDB();
    const { slug } = await params;
    
    console.log("Searching for blog with slug:", slug);
    
    // First, let's see all blogs to debug
    const allBlogs = await BlogModel.find({}).select('slug title');
    console.log("All blogs in database:", allBlogs.map(b => ({ slug: b.slug, title: b.title })));
    
    // Try to find by exact slug first, then try with question mark appended
    let blog = await BlogModel.findOne({ slug: slug })
      .populate('author', 'name email avatar')
      .populate('category', 'name slug');
    
    // If not found, try with question mark (for legacy data)
    if (!blog) {
      blog = await BlogModel.findOne({ slug: slug + '?' })
        .populate('author', 'name email avatar')
        .populate('category', 'name slug');
    }
    
    console.log("Found blog:", blog ? blog.title : "None");
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: blog,
    });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Blog getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ConnectDB();
    const { slug } = await params;

    // Check if slug is actually an ObjectId
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    const query = isObjectId ? { _id: slug } : { slug: slug };

    const deletedBlog = await BlogModel.findOneAndDelete(query);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog başarıyla silindi",
    });
  } catch (error) {
    console.error("Blog silme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Blog silinirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ 
      success: false, 
      message: "Yetkisiz erişim" 
    }, { status: 401 });
  }

  try {
    await ConnectDB();
    const { slug } = await params;

    // Blog düzenleme yetkisi kontrolü
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user?.permissions?.includes("blog:edit")) {
      return NextResponse.json({ 
        success: false, 
        message: "Blog düzenleme yetkiniz yok" 
      }, { status: 403 });
    }

    // Check if request is FormData (with image) or JSON
    const contentType = request.headers.get("content-type");
    let title, content, category, author, newImage = null;
    
    if (contentType?.includes("multipart/form-data")) {
      // FormData ile gelen request (görsel ile)
      const formData = await request.formData();
      title = formData.get("title");
      content = formData.get("content");
      category = formData.get("category");
      author = formData.get("author");
      newImage = formData.get("image") as File;
    } else {
      // JSON request (görsel olmadan)
      const body = await request.json();
      ({ title, content, category, author } = body);
    }

    // Check if slug is actually an ObjectId
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    const query = isObjectId ? { _id: slug } : { slug: slug };

    // Mevcut blog'u bul
    const existingBlog = await BlogModel.findOne(query);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog bulunamadı" },
        { status: 404 }
      );
    }

    // Yeni görsel yükleme ve eski görsel silme
    let imgUrl = existingBlog.image; // Varsayılan olarak mevcut görseli kullan
    
    if (newImage && newImage.size > 0) {
      try {
        // Eski görseli Cloudinary'den sil
        if (existingBlog.image) {
          const publicId = existingBlog.image.split('/').pop()?.split('.')[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`blog-images/${publicId}`);
          }
        }

        // Yeni görseli yükle
        const arrayBuffer = await newImage.arrayBuffer();
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
      } catch (imageError) {
        console.error("Image upload error:", imageError);
        return NextResponse.json(
          { success: false, message: "Görsel yüklenirken hata oluştu" },
          { status: 500 }
        );
      }
    }

    // Generate new slug from title if title is being updated
    const updateData: {
      title?: string;
      content?: string;
      category?: string;
      author?: string;
      image?: string;
      slug?: string;
      summary?: string;
    } = {
      title,
      content,
      category,
      author,
      image: imgUrl,
    };

    if (title) {
      updateData.slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      updateData.summary = content?.slice(0, 120) || '';
    }

    const updatedBlog = await BlogModel.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).populate('author', 'name email avatar').populate('category', 'name slug');

    return NextResponse.json({
      success: true,
      message: "Blog başarıyla güncellendi",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Blog güncelleme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Blog güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}