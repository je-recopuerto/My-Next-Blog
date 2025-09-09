import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/config/db";
import CategoryModel from "../../../../../lib/models/CategoryModel";

const initialCategories = [
    { name: "Teknoloji", description: "Teknoloji ile ilgili yazılar" },
    { name: "Yazılım", description: "Yazılım geliştirme ve programlama" },
    { name: "Oyun", description: "Oyun geliştirme ve oyun incelemeleri" },
    { name: "Deneyim", description: "Kişisel deneyimler ve hikayeler" }
];

export async function POST() {
    try {
        await ConnectDB();
        
        // Kategoriler zaten var mı kontrol et
        const existingCategories = await CategoryModel.find({});
        
        if (existingCategories.length > 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Kategoriler zaten mevcut" 
            });
        }

        // Kategorileri oluştur
        const categories = [];
        for (const cat of initialCategories) {
            const slug = cat.name
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const category = await CategoryModel.create({
                name: cat.name,
                slug: slug,
                description: cat.description
            });
            
            categories.push(category);
        }
        
        return NextResponse.json({ 
            success: true, 
            message: "Kategoriler başarıyla oluşturuldu",
            categories: categories
        });
    } catch (error) {
        console.error("Seed categories error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Kategoriler oluşturulurken hata oluştu" 
        }, { status: 500 });
    }
}
