import Link from "next/link";
import { Copyright } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 py-4 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <Copyright className="w-4 h-4 text-gray-600" /> {currentYear} Made by{" "}
            <Link
              href="https://www.linkedin.com/in/emrhn-gngr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 cursor-pointer hover:text-gray-500"
            >
              Emrhn
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}