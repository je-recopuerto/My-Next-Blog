import { MetadataRoute } from 'next'

interface BlogPost {
  slug: string;
  date: string;
  [key: string]: unknown;
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog`,
      {
        next: { revalidate: 3600 }
      }
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.blogs : [];
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const blogs = await getAllBlogPosts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = blogs
    .filter(blog => blog.slug) // Ensure slug exists
    .map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticPages, ...blogPages];
}
