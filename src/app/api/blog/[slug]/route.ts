import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/config/db";
import BlogModel from "../../../../../lib/models/BlogModel";

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