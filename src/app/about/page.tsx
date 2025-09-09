import MainLayout from "../components/MainLayout";

export default function AboutPage() {
  return (
    <MainLayout>
      <main className="py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Hakkımda</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              Merhaba! Ben Emirhan, yazılım geliştirici ve teknoloji meraklısıyım. 
              Bu blogda programlama, teknoloji trendleri ve kişisel projelerim hakkında yazıyorum.
            </p>
            <p className="text-gray-700 mb-4">
              Özellikle web geliştirme, JavaScript, React ve modern teknolojiler konularında 
              deneyimlerimi paylaşmayı seviyorum.
            </p>
            <p className="text-gray-700">
              Benimle iletişime geçmek isterseniz, sosyal medya hesaplarımdan 
              veya e-posta yoluyla ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
