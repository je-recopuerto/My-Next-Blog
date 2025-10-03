import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../../lib/config/db";
import BlogModel from "../../../../../../lib/models/BlogModel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ConnectDB();
    const { slug } = await params;

    // Önce mevcut blog'u bul
    const currentBlog = await BlogModel.findOne({ slug }).populate("category");
    if (!currentBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Aynı kategoriden ve farklı slug'a sahip blogları getir
    const relatedBlogs = await BlogModel.find({
      slug: { $ne: slug }, // Mevcut blog'u hariç tut
      category: currentBlog.category._id, // Aynı kategori
    })
      .populate("category", "name slug")
      .populate("author", "name email")
      .sort({ date: -1 })
      .limit(3)
      .select("title slug summary image date category author");

    // Eğer aynı kategoriden yeteri kadar blog yoksa, diğer kategorilerden ekle
    if (relatedBlogs.length < 3) {
      const additionalBlogs = await BlogModel.find({
        slug: { $ne: slug },
        category: { $ne: currentBlog.category._id },
      })
        .populate("category", "name slug")
        .populate("author", "name email")
        .sort({ date: -1 })
        .limit(3 - relatedBlogs.length)
        .select("title slug summary image date category author");

      relatedBlogs.push(...additionalBlogs);
    }

    return NextResponse.json({
      success: true,
      blogs: relatedBlogs,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}