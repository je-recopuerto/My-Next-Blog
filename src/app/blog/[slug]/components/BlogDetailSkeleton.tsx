import React from 'react';

const BlogDetailSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 animate-pulse py-10 ">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-4"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-4"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>




      {/* Featured image skeleton */}
      <div className="w-full h-96 bg-gray-200 rounded-xl mb-8"></div>

      {/* Content skeleton */}
      <div className="space-y-4 mb-12">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        
        <div className="my-6"></div>
        
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        <div className="my-6"></div>
        
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Related posts skeleton */}
      <div className="border-t pt-12">
        <div className="h-8 bg-gray-200 rounded-md w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20 mb-3"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;
