"use client";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: string | { _id: string; name: string; slug?: string };
  author: string | { _id: string; name: string; email?: string; avatar?: string };
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
      console.error('Error loading blogs:', error);
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
            <h2 className="text-xl font-semibold mb-2">Blog Posts</h2>
            <p className="text-gray-600">Total {blogs.length} posts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">Total 2 users</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Views</h2>
            <p className="text-gray-600">1,234 views this month</p>
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold">Blog Posts</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No blog posts yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {typeof blog.category === 'object' && blog.category !== null ? blog.category.name : blog.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {typeof blog.author === 'object' && blog.author !== null ? blog.author.name : blog.author}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(blog.date).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
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