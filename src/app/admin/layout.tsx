import Sidebar from "./components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
