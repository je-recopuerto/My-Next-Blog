"use client";
import { useState, useEffect } from "react";
import AddBlogForm from "./components/AddBlogForm";

interface Category {
  _id: string;
  name: string;
  slug: string;
  content: string;
}

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    summary: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };
    loadCategories();
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
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
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
          content: "",
          category: "",
          summary: "",
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
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
            <p className="text-gray-600 mt-2">Yeni bir blog yazısı oluşturun</p>
          </div>

          <AddBlogForm
            formData={formData}
            setFormData={setFormData}
            image={image}
            setImage={setImage}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            loading={loading}
            categories={categories}
            categoriesLoading={categoriesLoading}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default AddBlogPage;
