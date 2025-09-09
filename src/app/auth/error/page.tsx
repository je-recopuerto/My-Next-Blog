"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { FaExclamationTriangle } from "react-icons/fa"
import { Suspense } from "react"

function AuthErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return 'Erişim reddedildi. Bu hesapla giriş yapma yetkiniz yok.'
      case 'Configuration':
        return 'Sunucu yapılandırma hatası.'
      default:
        return 'Giriş yapılırken bir hata oluştu.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş Hatası</h1>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage(error)}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Tekrar Dene
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
