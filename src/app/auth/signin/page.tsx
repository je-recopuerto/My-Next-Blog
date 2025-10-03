"use client"
import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaGithub, FaLock, FaUser } from "react-icons/fa"
import Footer from "../../components/Footer"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMethod, setLoginMethod] = useState<"github" | "email" | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Zaten giriş yapmışsa admin'e yönlendir
    getSession().then((session) => {
      if (session) {
        router.push("/admin")
      }
    })
  }, [router])

  const handleGitHubSignIn = async () => {
    setLoading(true)
    try {
      await signIn("github", { 
        callbackUrl: "/admin",
        redirect: true 
      })
    } catch (error) {
      console.error("Giriş hatası:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/admin",
        redirect: false
      })

      if (result?.error) {
        alert("Giriş başarısız: Bu email için şifre gerekli veya hatalı şifre girdiniz")
      } else if (result?.ok) {
        router.push("/admin")
      }
    } catch (error) {
      console.error("Email giriş hatası:", error)
      alert("Giriş yapılırken hata oluştu")
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-indigo-600 text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Girişi</h1>
          <p className="text-gray-600">Blog yönetim paneline erişim</p>
        </div>

        {!loginMethod ? (
          // Giriş Yöntemi Seçimi
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-700 font-medium">Giriş yönteminizi seçin:</p>
            </div>
            
            <button
              onClick={() => setLoginMethod("github")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <FaGithub className="text-xl" />
              GitHub ile Giriş Yap
            </button>

            <button
              onClick={() => setLoginMethod("email")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <FaUser className="text-sm" />
              Email ile Giriş Yap
            </button>
          </div>
        ) : loginMethod === "github" ? (
          // GitHub Giriş
          <div className="space-y-4">
            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaGithub className="text-xl" />
                  GitHub ile Devam Et
                </>
              )}
            </button>
            
            <button
              onClick={() => setLoginMethod(null)}
              className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm transition-colors"
            >
              ← Geri dön
            </button>
          </div>
        ) : (
          // Email Giriş
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ornek@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Şifrenizi girin"
              />
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaUser className="text-sm" />
                  Email ile Giriş Yap
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setLoginMethod(null)}
              className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm transition-colors"
            >
              ← Geri dön
            </button>
          </form>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <FaUser className="text-blue-600" />
            <span>Sadece yetkili kullanıcılar giriş yapabilir</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← Ana sayfaya dön
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
