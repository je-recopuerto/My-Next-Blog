import MainLayout from "../../components/MainLayout";
import BlogDetailSkeleton from "./components/BlogDetailSkeleton";

export default function Loading() {
  return (
    <MainLayout>
      <BlogDetailSkeleton />
    </MainLayout>
  );
}
