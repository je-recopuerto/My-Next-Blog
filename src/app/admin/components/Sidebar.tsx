import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <div className='w-64 bg-gray-800 text-white min-h-screen'>
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-8'>Admin Panel</h2>
        <nav className='space-y-2'>
          <Link href="/admin" className='block px-4 py-2 rounded hover:bg-gray-700'>
            Ana Sayfa
          </Link>
          <Link href="/admin/addBlog" className='block px-4 py-2 rounded hover:bg-gray-700'>
            Yeni Blog Ekle
          </Link>
          <Link href="/admin/blogList" className='block px-4 py-2 rounded hover:bg-gray-700'>
            Blog Yazıları
          </Link>
          <Link href="/admin/users" className='block px-4 py-2 rounded hover:bg-gray-700'>
            Kullanıcılar
          </Link>
          <Link href="/admin/settings" className='block px-4 py-2 rounded hover:bg-gray-700'>
            Ayarlar
          </Link>
          <Link href="/" className='block px-4 py-2 rounded hover:bg-gray-700 mt-8 border-t border-gray-600 pt-4'>
            Ana Siteye Dön
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar