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

    // First, find the current blog
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

    // Fetch blogs from the same category with a different slug
    const relatedBlogs = await BlogModel.find({
      slug: { $ne: slug }, // Exclude the current blog
      category: currentBlog.category._id, // Same category
    })
      .populate("category", "name slug")
      .populate("author", "name email")
      .sort({ date: -1 })
      .limit(5) // Limit to 8 related posts
      .select("title slug summary image date category author");

    // If there are not enough blogs from the same category, add from other categories
    if (relatedBlogs.length < 5) {
      const additionalBlogs = await BlogModel.find({
        slug: { $ne: slug },
        category: { $ne: currentBlog.category._id },
      })
        .populate("category", "name slug")
        .populate("author", "name email")
        .sort({ date: -1 })
        .limit(10 - relatedBlogs.length)
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