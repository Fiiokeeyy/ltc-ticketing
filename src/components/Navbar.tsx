"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-zinc-900 transition-colors hover:text-orange-500"
          >
            <Image
              src="/ltc-logo.jpeg"
              alt="LTC Logo"
              width={40}
              height={40}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
            <span>LTC Indonesia</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  isActive("/") ? "text-orange-500" : "text-zinc-700"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/tiket"
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  isActive("/tiket") ? "text-orange-500" : "text-zinc-700"
                }`}
              >
                Jadwal Pertunjukan
              </Link>
              <Link
                href="/cara-pesan-tiket"
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  isActive("/cara-pesan-tiket")
                    ? "text-orange-500"
                    : "text-zinc-700"
                }`}
              >
                Cara Pesan Tiket
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-900 transition-colors hover:bg-zinc-100 md:hidden"
              aria-label="Toggle menu"
            >
              <div className="relative h-6 w-6">
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-200 bg-white px-6 py-4 shadow-inner">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium transition-colors hover:text-orange-500 ${
                  isActive("/") ? "text-orange-500" : "text-zinc-700"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/tiket"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium transition-colors hover:text-orange-500 ${
                  isActive("/tiket") ? "text-orange-500" : "text-zinc-700"
                }`}
              >
                Jadwal Pertunjukan
              </Link>
              <Link
                href="/cara-pesan-tiket"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium transition-colors hover:text-orange-500 ${
                  isActive("/cara-pesan-tiket")
                    ? "text-orange-500"
                    : "text-zinc-700"
                }`}
              >
                Cara Pesan Tiket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
