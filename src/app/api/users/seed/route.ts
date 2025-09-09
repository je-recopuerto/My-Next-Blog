import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/config/db";
import UserModel from "../../../../../lib/models/UserModel";
import bcrypt from "bcrypt";

export async function POST() {
    try {
        await ConnectDB();
        
        // İlk kurucu kullanıcıyı oluştur
        const foundUser = await UserModel.findOne({ role: "Owner" });
        
        if (foundUser) {
            return NextResponse.json({ 
                success: false, 
                message: "Owner user already exists" 
            });
        }

        const password = process.env.OWNER_PASSWORD || "defaultpassword";
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword ==> ", hashedPassword);

        const ownerUser = await UserModel.create({
            email: "emirhan_gungor2009@hotmail.com",
            name: "Emirhan Güngör",
            role: "Owner",
            password: hashedPassword,
            isActive: true
        });

        return NextResponse.json({ 
            success: true, 
            message: "Owner user created successfully",
            user: ownerUser
        });
    } catch (error) {
        console.error("Seed user error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Kullanıcı oluşturulurken hata oluştu" 
        }, { status: 500 });
    }
}
