"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaTimes, FaSave } from "react-icons/fa";

interface Blog {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  image: string;
  date: string;
}

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal states
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    author: ""
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

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

  const filterBlogs = () => {
    let filtered = blogs;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Kategori filtresi
    if (selectedCategory !== "all") {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  };

  // Modal açma fonksiyonları
  const openViewModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewModal(true);
  };

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditForm({
      title: blog.title,
      description: blog.description,
      category: blog.category,
      author: blog.author
    });
    setEditModal(true);
  };

  const openDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteModal(true);
  };

  // Modal kapatma fonksiyonu
  const closeModals = () => {
    setViewModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedBlog(null);
  };

  // Blog güncelleme
  const updateBlog = async () => {
    if (!selectedBlog) return;

    try {
      const response = await fetch(`/api/blog/${selectedBlog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      
      if (data.success) {
        // Listeyi güncelle
        setBlogs(blogs.map(blog => 
          blog._id === selectedBlog._id 
            ? { ...blog, ...editForm }
            : blog
        ));
        closeModals();
        alert("Blog başarıyla güncellendi!");
      } else {
        alert(data.message || "Blog güncellenirken hata oluştu!");
      }
    } catch (error) {
      console.error('Blog güncelleme hatası:', error);
      alert("Blog güncellenirken bir hata oluştu!");
    }
  };

  // Blog silme
  const deleteBlog = async () => {
    if (!selectedBlog) return;

    try {
      const response = await fetch(`/api/blog/${selectedBlog._id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Listeyi güncelle
        setBlogs(blogs.filter(blog => blog._id !== selectedBlog._id));
        closeModals();
        alert("Blog başarıyla silindi!");
      } else {
        alert(data.message || "Blog silinirken hata oluştu!");
      }
    } catch (error) {
      console.error('Blog silme hatası:', error);
      alert("Blog silinirken bir hata oluştu!");
    }
  };

  const getUniqueCategories = () => {
    const categories = blogs.map(blog => blog.category);
    return [...new Set(categories)];
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Yazıları</h1>
              <p className="text-gray-600 mt-2">Tüm blog yazılarınızı yönetin</p>
            </div>
            <button 
              onClick={() => window.location.href = "/admin/addBlog"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Yeni Blog
            </button>
          </div>

          {/* Filtreleme ve Arama */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Arama */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Blog ara (başlık, açıklama, yazar)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Kategori Filtresi */}
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-600">
              Toplam {blogs.length} blog - Gösterilen {filteredBlogs.length} blog
            </div>
          </div>
        </div>

        {/* Blog Listesi - Tablo Formatı */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedCategory !== "all" ? "Arama sonucu bulunamadı" : "Henüz blog yazısı yok"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "all" 
                ? "Farklı arama kriterleri ile tekrar deneyin" 
                : "İlk blog yazınızı oluşturmak için yeni blog butonuna tıklayın"}
            </p>
            <button 
              onClick={() => window.location.href = "/admin/addBlog"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              İlk Blogunuzu Oluşturun
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yazar
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                      {/* Blog Bilgisi */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 mr-4">
                            <img 
                              src={blog.image} 
                              alt={blog.title}
                              className="h-16 w-16 rounded-lg object-cover border"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {blog.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs mt-1">
                              {blog.description.length > 60 
                                ? blog.description.substring(0, 60) + "..." 
                                : blog.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {blog.category}
                        </span>
                      </td>

                      {/* Yazar */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">👤</span>
                          {blog.author}
                        </div>
                      </td>

                      {/* Tarih */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{new Date(blog.date).toLocaleDateString('tr-TR')}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(blog.date).toLocaleTimeString('tr-TR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </td>

                      {/* İşlemler */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Görüntüle */}
                          <button 
                            onClick={() => openViewModal(blog)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            title="Görüntüle"
                          >
                            <FaEye className="w-3 h-3 mr-1" />
                            Görüntüle
                          </button>

                          {/* Düzenle */}
                          <button 
                            onClick={() => openEditModal(blog)}
                            className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            title="Düzenle"
                          >
                            <FaEdit className="w-3 h-3 mr-1" />
                            Düzenle
                          </button>

                          {/* Sil */}
                          <button 
                            onClick={() => openDeleteModal(blog)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            title="Sil"
                          >
                            <FaTrash className="w-3 h-3 mr-1" />
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination (gelecekte eklenebilir) */}
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Toplam <span className="font-medium">{filteredBlogs.length}</span> blog gösteriliyor
                </div>
                <div className="text-sm text-gray-500">
                  {blogs.length} toplam blog
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Görüntüle Modal */}
      {viewModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Blog Önizleme</h2>
              <button 
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <img 
                src={selectedBlog.image} 
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {selectedBlog.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span className="mr-4">👤 {selectedBlog.author}</span>
                <span>{new Date(selectedBlog.date).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedBlog.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Düzenle Modal */}
      {editModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Blog Düzenle</h2>
              <button 
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); updateBlog(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yazar
                    </label>
                    <input
                      type="text"
                      value={editForm.author}
                      onChange={(e) => setEditForm({...editForm, author: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave className="w-4 h-4" />
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {deleteModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FaTrash className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Blog Yazısını Sil
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  "<strong>{selectedBlog.title}</strong>" başlıklı blog yazısını silmek istediğinizden emin misiniz? 
                  Bu işlem geri alınamaz.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={deleteBlog}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTrash className="w-4 h-4" />
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BlogListPage