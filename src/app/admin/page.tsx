
"use client";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  image: string;
  date: string;
}

const AdminPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Blog yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Blog Yazıları</h2>
            <p className="text-gray-600">Toplam {blogs.length} yazı</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Kullanıcılar</h2>
            <p className="text-gray-600">Toplam 2 kullanıcı</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Görüntülenmeler</h2>
            <p className="text-gray-600">Bu ay 1,234 görüntülenme</p>
          </div>
        </div>

        {/* Blog Listesi */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold">Blog Yazıları</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Yükleniyor...</div>
          ) : blogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Henüz blog yazısı yok</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {blog.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{blog.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{blog.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(blog.date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Düzenle</button>
                        <button className="text-red-600 hover:text-red-900">Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminPage