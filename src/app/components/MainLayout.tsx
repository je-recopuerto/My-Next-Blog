import Navbar from "./Navbar";
import Footer from "./Footer";
import { borel } from "../ui/fonts";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 flex-grow">
        <Navbar borel={borel} />
        {children}
      </div>
      <Footer />
    </div>
  );
}
