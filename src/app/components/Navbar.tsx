import Link from "next/link";

type NavbarProps = {
  borel: { className: string };
};

export default function Navbar({ borel }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between py-4 mb-8 border-gray-200">
      <div className="font-bold text-xl">
        <Link href="/" className={borel.className}>
          emrhn
        </Link>
      </div>
      <div className="flex font-bold gap-4 items-center">
        <Link
          href="/about"
          className="w-32 px-4 py-2 text-center whitespace-nowrap hover:bg-gray-100"
        >
          Hakkımda
        </Link>
        <Link
          href="/blog"
          className="w-32 px-4 py-2 text-center hover:bg-gray-100"
        >
          Blog
        </Link>
      </div>
    </nav>
  );
}
