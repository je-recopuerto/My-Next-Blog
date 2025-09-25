"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "./components/Sidebar";
import { Card } from "../components/ui/card";
import { SidebarProvider, useSidebar } from "./components/SidebarContext";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className={`flex-1 overflow-hidden transition-all duration-300 ${
        isOpen ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
        <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Loading
    
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="p-8 shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 border border-blue-400 opacity-30"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading admin panel...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}
