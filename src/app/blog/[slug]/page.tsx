

import ReactMarkdown from 'react-markdown';
import blogDataItem from '../../../../data/blog_data.json';
import { notFound } from 'next/navigation';

interface BlogParams {
  params: { slug: string };
}

export default function BlogDetailPage({ params }: BlogParams) {
  const post = blogDataItem.posts.find((p: any) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <img src={post.image_url || "/blog/asset1.jpg"} alt={post.title} className="w-full object-cover rounded-lg mb-6" />
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-700 mb-6">
        <ReactMarkdown>{post.content || post.summary}</ReactMarkdown>
      </div>
      <div className="text-sm text-gray-500">Category: {post.category_id}</div>
    </div>
  );
}
