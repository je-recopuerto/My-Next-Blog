import Navbar from "./Navbar";
import { borel } from "../ui/fonts";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <Navbar borel={borel} />
      {children}
    </div>
  );
}
