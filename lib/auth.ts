import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { ConnectDB } from "./config/db"
import UserModel from "./models/UserModel"
import bcrypt from "bcrypt"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      permissions?: string[];
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID!,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await ConnectDB();
          
          // Veritabanında kullanıcı var mı kontrol et
          const user = await UserModel.findOne({ 
            email: credentials.email,
            isActive: true 
          });
          
          if (!user) {
            return null;
          }

          // Şifre kontrolü - sadece şifresi olan kullanıcılar giriş yapabilir
          if (!user.password) {
            return null; // Bu kullanıcı sadece GitHub ile giriş yapabilir
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role,
            permissions: user.permissions
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await ConnectDB();
        
        // Kullanıcı veritabanında var mı kontrol et
        let dbUser = await UserModel.findOne({ email: user.email });
        
        if (!dbUser) {
          // Yeni kullanıcı - varsayılan olarak "Member" rolü ver
          dbUser = await UserModel.create({
            email: user.email,
            name: user.name || "Anonim",
            avatar: user.image || "",
            role: "Member",
            githubId: account?.providerAccountId,
            isActive: true
            // password alanı yok - GitHub kullanıcısı
          });
        } else {
          // Mevcut kullanıcı - GitHub ID'yi güncelle (eğer yoksa)
          const updateData: Record<string, unknown> = {
            lastLogin: new Date(),
            avatar: user.image || dbUser.avatar,
          };
          
          if (account?.providerAccountId && !dbUser.githubId) {
            updateData.githubId = account.providerAccountId;
          }
          
          await UserModel.findByIdAndUpdate(dbUser._id, updateData);
        }
        
        // Aktif olmayan kullanıcıların girişini engelle
        if (!dbUser.isActive) {
          return false;
        }
        
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          await ConnectDB();
          const dbUser = await UserModel.findOne({ email: user.email });
          
          token.accessToken = account.access_token;
          token.role = dbUser?.role || "Member";
          token.permissions = dbUser?.permissions || [];
        } catch (error) {
          console.error("JWT error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user.role = token.role as string | undefined;
      session.user.permissions = token.permissions as string[] | undefined;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  secret: process.env.NEXTAUTH_SECRET,
}
