
import ReactMarkdown from 'react-markdown';
import blogDataItem from '../../../../data/blog_data.json';
import { notFound } from 'next/navigation';
import MainLayout from "../../components/MainLayout";

interface BlogParams {
  params: Promise<{ slug: string }>;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image_url: string;
  published_date: string;
  category_id: number;
  tags: string[];
}

export default async function BlogDetailPage({ params }: BlogParams) {
  const { slug } = await params;
  const posts = blogDataItem.posts as Post[];
  const post = posts.find((p) => p.slug === slug);
  
  if (!post) return notFound();

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
      <img 
        src={post.image_url || "/blog/asset1.jpg"} 
        alt={post.title} 
        className="w-full object-cover rounded-lg mb-6" 
      />
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-700 mb-6">
        <ReactMarkdown>{post.content || post.summary}</ReactMarkdown>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        <p><strong>Yayın Tarihi:</strong> {new Date(post.published_date).toLocaleDateString()}</p>
        <p><strong>Kategori:</strong> {post.category_id}</p>
        {post.tags && (
          <p><strong>Etiketler:</strong> {post.tags.join(', ')}</p>
        )}
      </div>
    </div>
    </MainLayout>
  );
}
