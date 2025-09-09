import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/config/db";
import BlogModel from "../../../../../lib/models/BlogModel";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        await ConnectDB();
        
        const { id } = params;
        const body = await request.json();
        
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            id, 
            {
                title: body.title,
                description: body.description,
                category: body.category,
                author: body.author
            }, 
            { new: true }
        );
        
        if (!updatedBlog) {
            return NextResponse.json({ 
                success: false, 
                message: "Blog bulunamadı" 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Blog başarıyla güncellendi",
            blog: updatedBlog
        });
    } catch (error) {
        console.error("Blog güncelleme hatası:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Blog güncellenirken hata oluştu" 
        }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await ConnectDB();
        
        const { id } = params;
        
        const deletedBlog = await BlogModel.findByIdAndDelete(id);
        
        if (!deletedBlog) {
            return NextResponse.json({ 
                success: false, 
                message: "Blog bulunamadı" 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Blog başarıyla silindi" 
        });
    } catch (error) {
        console.error("Blog silme hatası:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Blog silinirken hata oluştu" 
        }, { status: 500 });
    }
}
