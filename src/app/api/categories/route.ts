import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/config/db";
import CategoryModel from "../../../../lib/models/CategoryModel";

export async function GET() {
    try {
        await ConnectDB();
        
        const categories = await CategoryModel.find({}).sort({ name: 1 });
        
        return NextResponse.json({ 
            success: true, 
            categories: categories
        });
    } catch (error) {
        console.error("Categories fetch error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Kategoriler yüklenirken hata oluştu" 
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ConnectDB();
        
        const { name, description } = await request.json();
        
        // Slug oluştur (Türkçe karakterleri değiştir)
        const slug = name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const categoryData = {
            name,
            slug,
            description: description || ""
        };

        const newCategory = await CategoryModel.create(categoryData);
        
        return NextResponse.json({ 
            success: true, 
            message: "Kategori başarıyla oluşturuldu",
            category: newCategory
        });
    } catch (error) {
        console.error("Category creation error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Kategori oluşturulurken hata oluştu" 
        }, { status: 500 });
    }
}
