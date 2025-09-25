import MainLayout from "./components/MainLayout";
import BlogList from "./components/BlogList";
import Image from "next/image";
import FeaturedBlogs from "./components/FeaturedBlogs";
export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center border rounded-xl">
        <Image
          width={3000}
          height={2000}
          src={"/blog/asset2.jpg"}
          alt={"Hero background"}
          className="absolute inset-0 w-full h-full rounded-xl object-cover -z-10"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40 rounded-xl -z-5"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl text-white mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Welcome to My NextBlog
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
            I share my articles, thoughts, and projects on my personal blog
            site.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <input
              type="email"
              placeholder="Enter your email for updates"
              className="px-6 py-3 rounded-lg text-black bg-white border-0 outline-none focus:ring-4 focus:ring-blue-300 transition-all w-full sm:w-80"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Blog List Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-600">
              Discover my latest thoughts and insights
            </p>
          </div>
          {/* Blog List Component will go here */}
          <div className="grid grid-cols-12">
            <div className="col-span-9">
              <BlogList limit={6} showLoadMore={false} />
            </div>
            <div className="col-span-3">
              <FeaturedBlogs limit={3} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
