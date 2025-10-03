import { Lightbulb } from "lucide-react";
import MainLayout from "../components/MainLayout";

export default function AboutPage() {
  return (
    <MainLayout>
      <main className="pb-10 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 transform hover:scale-[1.01] transition-transform duration-300">
            {/* Hero Introduction */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Hello! I{"'"}m{" "}
                <span className="bg-gradient-to-r from-black to-blue-500 bg-clip-text text-transparent">
                  Emirhan
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A 2025 grad{" "}
                <span className="font-semibold text-blue-600">
                  Computer Engineering
                </span>{" "}
              </p>
            </div>

            {/* Tech Stack Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                My TechStack
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Had experience with
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "JavaScript",
                      "React.js",
                      "TailwindCSS",
                      "HTML/CSS",
                      "Bootstrap",
                      "Node.js",
                      "MySQL",
                      "Git",
                      "PHP",
                      "C#",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white text-gray-700 rounded-full hover:bg-gray-200 text-sm font-medium shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Currently Learning{" / "}Mastering
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "MongoDB"].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white text-gray-700 rounded-full hover:bg-purple-200 text-sm font-medium shadow-sm border-2 border-purple-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About This Blog */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What{"'"}s This Blog?
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed text-center max-w-4xl mx-auto">
                Welcome to my digital playground!
                <br /> This blog is where I share my coding adventures, showcase
                personal projects, and explore the latest in technology.
              </p>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Tech Stack Powering This Site
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-blue-600">
                      Frontend:
                    </span>
                    <span className="text-gray-700">
                      {" "}
                      Next.js 15, React 19, TypeScript, Tailwind CSS 4
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-600">
                      Backend:
                    </span>
                    <span className="text-gray-700">
                      {" "}
                      Next.js API Routes, MongoDB, Mongoose
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-600">Auth:</span>
                    <span className="text-gray-700">
                      {" "}
                      NextAuth.js (GitHub OAuth + Credentials)
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-600">
                      Storage:
                    </span>
                    <span className="text-gray-700">
                      {" "}
                      Cloudinary for optimized image delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Integration Highlight */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                <svg
                  className="w-5 h-5 text-purple-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <Lightbulb />
                </svg>
                <span className="text-purple-800 font-semibold">
                  AI-Powered Content Creation
                </span>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover the future of content creation!
                <br /> My admin dashboard features{" "}
                <span className="font-bold">AI integration</span> that crafts
                rich, engaging content from simple titles and summaries.
                <br /> Some content may appear <span className="font-bold">AI-generated</span> because it is!<br /> but I can create content without AI, as I{"'"}m eager to
                share authentic insights from my experiences. <br /> I will add a tag for show which content is not AI-generated.
              </p>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Let{"'"}s Connect & Create
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                I{"'"}m always excited to collaborate on innovative projects,
                discuss emerging technologies, or explore new opportunities. Don
                {"'"}t hesitate to reach out!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="https://www.linkedin.com/in/emrhn-gngr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-1.337-.026-3.059-1.865-3.059-1.866 0-2.151 1.455-2.151 2.959v5.704h-3v-11h2.879v1.5h.04c.401-.757 1.381-1.557 2.841-1.557 3.039 0 3.601 2.001 3.601 4.604v6.453z" />
                  </svg>
                  Connect on LinkedIn
                </a>

                <div className="flex items-center text-gray-500">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                  <span className="text-sm font-medium">
                    Available for opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
