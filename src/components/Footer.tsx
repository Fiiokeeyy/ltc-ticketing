import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-16 text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Main Grid - 4 Columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/ltc-logo.jpeg"
                alt="LTC Logo"
                width={40}
                height={40}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-lg font-bold text-zinc-100">
                LTC Indonesia
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform pemesanan tiket resmi LTC Indonesia untuk pengalaman seni
              yang tak terlupakan.
            </p>

            {/* Social Media Icons - Moved here */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/labteaterciputat?igsh=MXMzZHlkc3M0dmJ0Ng=="
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="h-5 w-5 text-zinc-600 group-hover:text-zinc-900" />
              </a>
              <a
                href="https://youtube.com/@labteaterciputat?si=ZIjOj9wnxgDH_CPq"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className="h-5 w-5 text-zinc-600 group-hover:text-zinc-900" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
                aria-label="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className="h-5 w-5 text-zinc-600 group-hover:text-zinc-900" />
              </a>
            </div>
          </div>

          {/* Column 2 - Jelajahi */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-zinc-100">Jelajahi</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors hover:text-orange-500"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/tiket"
                  className="text-sm transition-colors hover:text-orange-500"
                >
                  Jadwal Pertunjukan
                </Link>
              </li>
              <li>
                <Link
                  href="/cara-pesan-tiket"
                  className="text-sm transition-colors hover:text-orange-500"
                >
                  Cara Pesan Tiket
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Dukungan */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-zinc-100">Dukungan</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="text-sm transition-colors hover:text-orange-500"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/pusat-bantuan"
                  className="text-sm transition-colors hover:text-orange-500"
                >
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link
                  href="/tulis-ulasan"
                  className="text-sm transition-colors hover:text-orange-500"
                >
                  Tulis Ulasan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Hubungi Kami */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-zinc-100">
              Hubungi Kami
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <span>
                  Sinar Pamulang Blok B9 No 9, Pamulang Barat,
                  <br />
                  Tangerang Selatan, Banten 15417
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-400">
                <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                <span>0882-9111-5815</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-400">
                <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="text-sm">ltc.indonesia26@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-zinc-800 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            © {currentYear} LTC Indonesia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
