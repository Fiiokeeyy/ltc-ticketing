import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  UserCheck,
  CreditCard,
  Upload,
  Mail,
  ArrowRight,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import ScrollAnimation from "@/components/ScrollAnimation";

export const metadata: Metadata = {
  title: "Cara Pesan Tiket - LTC Indonesia",
  description:
    "Panduan lengkap cara memesan tiket pertunjukan teater di LTC Indonesia",
};

export default function CaraPesanTiketPage() {
  const steps = [
    {
      icon: Search,
      title: "Pilih Pertunjukan",
      description:
        "Lihat jadwal pertunjukan yang tersedia di halaman Jadwal. Pilih pertunjukan yang ingin Anda tonton dan klik tombol 'Pesan Tiket' untuk melihat detail.",
      color: "orange",
    },
    {
      icon: UserCheck,
      title: "Isi Data Diri",
      description:
        "Lengkapi formulir pemesanan dengan data diri Anda (nama lengkap, email, nomor WhatsApp). Pilih kategori tiket dan jumlah tiket yang diinginkan, kemudian pilih metode pembayaran.",
      color: "blue",
    },
    {
      icon: CreditCard,
      title: "Lakukan Pembayaran",
      description:
        "Setelah formulir terisi, klik 'Buat Pesanan'. Anda akan menerima email konfirmasi dengan instruksi pembayaran. Transfer sesuai nominal yang tertera dalam waktu 24 jam.",
      color: "green",
    },
    {
      icon: Upload,
      title: "Upload Bukti Pembayaran",
      description:
        "Setelah melakukan transfer, upload bukti pembayaran (screenshot/foto) melalui halaman pembayaran. Format yang didukung: JPG, PNG, atau PDF (maksimal 5MB).",
      color: "purple",
    },
    {
      icon: Mail,
      title: "Tunggu E-Tiket via Email",
      description:
        "Tim kami akan memverifikasi pembayaran Anda. Setelah terverifikasi, e-tiket akan dikirim ke email Anda. Simpan e-tiket dan tunjukkan saat masuk venue pertunjukan.",
      color: "pink",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title={<>Cara Pesan <span className="text-orange-500">Tiket</span></>}
        description="Ikuti langkah-langkah mudah berikut untuk memesan tiket pertunjukan Anda"
        maxWidth="4xl"
      />

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollAnimation key={index} delay={index * 100} direction={index % 2 === 0 ? "right" : "left"}>
                <div
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md md:p-8"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                      <Icon className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-zinc-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="leading-relaxed text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </div>

                  {index < steps.length - 1 && (
                    <div className="mt-6 flex justify-center md:mt-4">
                      <ArrowRight className="h-6 w-6 text-zinc-300" />
                    </div>
                  )}
                </div>
              </ScrollAnimation>
            );
          })}
        </div>

        {/* Info Box */}
        <ScrollAnimation delay={200} direction="up" className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-blue-900">
            <Mail className="h-5 w-5" />
            Informasi Penting
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                Pastikan email yang Anda masukkan aktif dan benar, karena semua
                informasi pesanan akan dikirim ke email tersebut.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                Selesaikan pembayaran dalam waktu 24 jam setelah pemesanan.
                Pesanan akan otomatis dibatalkan jika melewati batas waktu.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                Simpan ID pesanan Anda untuk memudahkan proses verifikasi dan
                komunikasi dengan tim kami.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                E-tiket yang sudah dikirim tidak dapat dikembalikan atau
                ditukar.
              </span>
            </li>
          </ul>
        </ScrollAnimation>

        {/* CTA */}
        <ScrollAnimation delay={300} direction="up" className="mt-12 text-center">
          <Link
            href="/tiket"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-orange-600"
          >
            Lihat Jadwal Pertunjukan
            <ArrowRight className="h-5 w-5" />
          </Link>
        </ScrollAnimation>

        {/* Need Help */}
        <ScrollAnimation delay={400} direction="up" className="mt-8 text-center">
          <p className="text-sm text-zinc-600">
            Masih ada pertanyaan?{" "}
            <Link
              href="/pusat-bantuan"
              className="font-medium text-orange-500 hover:underline"
            >
              Kunjungi Pusat Bantuan
            </Link>
          </p>
        </ScrollAnimation>
      </div>
    </div>
  );
}
