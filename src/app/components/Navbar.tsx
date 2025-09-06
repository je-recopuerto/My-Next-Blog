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
          Ben Kimim?
        </Link>{" "}
        <Link
          href="/blog"
          className="w-32 px-4 py-2 text-center hover:bg-gray-100"
        >
          Blog
        </Link>
        <Link
          href="/admin/login"
          className="w-32 px-4 py-2 text-center bg-green-200 text-green-700 hover:bg-green-300"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
