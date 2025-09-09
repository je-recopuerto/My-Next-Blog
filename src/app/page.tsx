import MainLayout from "./components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <main className="py-10">
        <div className="text-center flex justify-center flex-col">
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <p className="text-lg text-gray-600 mb-8">I share my articles, thoughts, and projects on my personal blog site.</p>
          <div className="flex justify-center gap-4">
          <input type="mail" placeholder="Write your mail"/>
          </div>
        </div>
        

      </main>
    </MainLayout>
  );
}
