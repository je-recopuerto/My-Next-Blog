import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Production'da console.log kaldırılacak
    if (process.env.NODE_ENV === 'development') {
      console.log("Middleware çalıştı:", req.nextUrl.pathname)
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Admin sayfalarına sadece aktif token'ı olan kullanıcılar erişebilir
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/api/users/:path*", "/api/blog/:path*"]
}
