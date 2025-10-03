import MainLayout from "../components/MainLayout";
import BlogSkeleton from "./components/BlogSkeleton";

export default function Loading() {
  return (
    <MainLayout>
      <BlogSkeleton />
    </MainLayout>
  );
}