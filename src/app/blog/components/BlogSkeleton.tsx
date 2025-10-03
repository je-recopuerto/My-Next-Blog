import React from 'react';

const BlogSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col py-10 gap-4">
        <div className="h-16 bg-gray-200 rounded-md w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded-md w-32 mb-8"></div>
        
        {/* Filter skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="h-10 bg-gray-200 rounded-md w-20"></div>
          <div className="h-10 bg-gray-200 rounded-md w-24"></div>
          <div className="h-10 bg-gray-200 rounded-md w-28"></div>
          <div className="h-10 bg-gray-200 rounded-md w-22"></div>
        </div>
        
        {/* Blog cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
              {/* Image skeleton */}
              <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
              
              {/* Category badge skeleton */}
              <div className="h-6 bg-gray-200 rounded-full w-20 mb-3"></div>
              
              {/* Title skeleton */}
              <div className="space-y-2 mb-3">
                <div className="h-6 bg-gray-200 rounded-md w-full"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
              </div>
              
              {/* Author and date skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded-md w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;