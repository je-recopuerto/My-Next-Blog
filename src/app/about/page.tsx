import MainLayout from "../components/MainLayout";

export default function AboutPage() {
  return (
    <MainLayout>
      <main className="py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Me</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              Hello! I{"'"}m Emirhan, a software developer and technology enthusiast.
              On this blog, I write about programming, technology trends, and my
              personal projects.
            </p>
            <p className="text-gray-700 mb-4">
              I especially enjoy sharing my experiences in web development,
              JavaScript, React, and modern technologies.
            </p>
            <p className="text-black">
              This website is under active development, and I{"'"}m always looking to improve it.
            </p>
            <p className="text-gray-700">
              If you{"'"}d like to get in touch with me, feel free to reach out via my
              social media accounts or email.
            </p>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
