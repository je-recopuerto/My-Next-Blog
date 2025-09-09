import { NextResponse } from "next/server"
import { ConnectDB } from "../../../../lib/config/db"
import { writeFile } from "fs"
import BlogModel from "../../../../lib/models/BlogModel"

export async function GET(request: Request) {
    try {
        await ConnectDB();
        
        // MongoDB'den tüm blogları çek
        const blogs = await BlogModel.find({}).sort({ date: -1 });
        
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
    try {
        await ConnectDB();
        
        const formData = await request.formData()
        const timestamp = Date.now();

        const image = formData.get("image") as File;
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        const path = `./public/blog/${timestamp}-${image.name}`;
        await writeFile(path, buffer, (err) => { if (err) console.log(err) });
        const imgUrl = `/blog/${timestamp}-${image.name}`;
        const blogData = {
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            author: formData.get("author"),
            image: imgUrl,
            authorImg: formData.get("authorImg"),
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
