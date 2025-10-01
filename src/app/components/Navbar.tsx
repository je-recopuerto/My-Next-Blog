/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaUser, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

type NavbarProps = {
  borel: { className: string };
};

export default function Navbar({ borel }: NavbarProps) {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between pt-4 mb-8 border-gray-200">
      <div className="font-bold text-xl">
        <Link href="/" className={borel.className}>
          emrhn
        </Link>
      </div>
      <div className="flex font-bold gap-4 items-center">
        <Link
          href="/about"
          className="w-32 px-4 py-2 text-center whitespace-nowrap hover:bg-gray-100 rounded transition-colors"
        >
          About Me
        </Link>
        <Link
          href="/blog"
          className="w-32 px-4 py-2 text-center hover:bg-gray-100 rounded transition-colors"
        >
          Blog
        </Link>
      </div>
    </nav>
  );
}
