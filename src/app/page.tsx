import MainLayout from "./components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <main className="py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hoş Geldiniz</h1>
          <p className="text-lg text-gray-600 mb-8">Kişisel blog sitemde yazılarımı, düşüncelerimi ve projelerimi paylaşıyorum.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Blog</h3>
            <p className="text-gray-600">En son makalelerimi ve düşüncelerimi okuyun.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Hakkımda</h3>
            <p className="text-gray-600">Benim hakkımda daha fazla bilgi edinin.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">İletişim</h3>
            <p className="text-gray-600">İş birlikleri için benimle iletişime geçin.</p>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
