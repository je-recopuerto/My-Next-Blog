"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaSave, FaTimes, FaUpload } from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    authorImg: ""
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error('Kategoriler yüklenemedi:', data.message);
        // Eğer kategoriler yoksa, seed endpoint'ini çağır
        await seedCategories();
      }
    } catch (error) {
      console.error('Kategoriler yükleme hatası:', error);
      // Eğer kategoriler yoksa, seed endpoint'ini çağır
      await seedCategories();
    } finally {
      setCategoriesLoading(false);
    }
  };

  const seedCategories = async () => {
    try {
      const response = await fetch('/api/categories/seed', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Kategori seed hatası:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      alert("Lütfen bir resim seçin!");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("authorImg", formData.authorImg);
      formDataToSend.append("image", image);

      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert("Blog başarıyla oluşturuldu!");
        // Formu temizle
        setFormData({
          title: "",
          description: "",
          category: "",
          author: "",
          authorImg: ""
        });
        setImage(null);
        setImagePreview("");
        // Blog listesine yönlendir
        window.location.href = "/admin/blogList";
      } else {
        alert(data.message || "Blog oluşturulurken hata oluştu!");
      }
    } catch (error) {
      console.error('Blog oluşturma hatası:', error);
      alert("Blog oluşturulurken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
            <p className="text-gray-600 mt-2">Yeni bir blog yazısı oluşturun</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sol Kolon */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Başlığı *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Blog başlığını girin..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    {categoriesLoading ? (
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                        Kategoriler yükleniyor...
                      </div>
                    ) : (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Kategori seçin...</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yazar *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Yazar adını girin..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yazar Resmi URL
                    </label>
                    <input
                      type="text"
                      name="authorImg"
                      value={formData.authorImg}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Yazar resmi URL'sini girin..."
                    />
                  </div>
                </div>

                {/* Sağ Kolon */}
                <div className="space-y-6">
                  {/* Resim Yükleme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Resmi *
                    </label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img 
                            src={imagePreview} 
                            alt="Önizleme" 
                            className="mx-auto h-48 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setImagePreview("");
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Resmi Kaldır
                          </button>
                        </div>
                      ) : (
                        <div className="pointer-events-none">
                          <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-600">Resim yüklemek için tıklayın</p>
                          <p className="text-sm text-gray-400">PNG, JPG, JPEG (Max. 5MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Açıklama - Full Width */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog İçeriği *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Blog içeriğini buraya yazın... (Markdown desteklenir)"
                  required
                />
              </div>

              {/* Butonlar */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => window.location.href = "/admin/blogList"}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FaTimes className="w-4 h-4" />
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="w-4 h-4" />
                  {loading ? "Kaydediliyor..." : "Blog Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBlogPage;
