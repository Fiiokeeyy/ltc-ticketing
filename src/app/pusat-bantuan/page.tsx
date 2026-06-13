"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";
import PageHero from "@/components/PageHero";

const faqs = [
  {
    question: "Bagaimana cara memesan tiket?",
    answer:
      "Anda dapat memesan tiket melalui halaman Jadwal. Pilih pertunjukan yang diinginkan, klik 'Pesan Tiket', isi formulir pemesanan, pilih metode pembayaran, dan selesaikan transaksi. Email konfirmasi akan dikirim setelah pesanan dibuat.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menerima pembayaran melalui transfer bank (myBCA, blu, Superbank) dan QRIS. Instruksi pembayaran lengkap akan dikirimkan melalui email setelah Anda membuat pesanan.",
  },
  {
    question: "Berapa lama batas waktu pembayaran?",
    answer:
      "Pembayaran harus diselesaikan dalam waktu 24 jam setelah pesanan dibuat. Jika melewati batas waktu, pesanan akan otomatis dibatalkan dan Anda perlu melakukan pemesanan ulang.",
  },
  {
    question:
      "Bagaimana jika saya salah transfer atau transfer ke rekening lain?",
    answer:
      "Jika Anda salah transfer, segera hubungi tim kami melalui WhatsApp atau email dengan melampirkan bukti transfer dan ID pesanan. Kami akan membantu memverifikasi pembayaran Anda. Namun, untuk transfer ke rekening yang salah, silakan hubungi bank Anda terlebih dahulu.",
  },
  {
    question: "Berapa lama proses verifikasi pembayaran?",
    answer:
      "Verifikasi pembayaran biasanya memakan waktu maksimal 1x24 jam pada hari kerja setelah bukti pembayaran diunggah. E-tiket akan dikirim ke email Anda setelah pembayaran terverifikasi.",
  },
  {
    question: "Bagaimana cara mengupload bukti pembayaran?",
    answer:
      "Setelah melakukan pembayaran, buka link halaman pembayaran yang tercantum di email konfirmasi Anda. Upload screenshot atau foto bukti transfer dalam format JPG, PNG, atau PDF (maksimal 5MB). Pastikan semua detail transfer terlihat jelas.",
  },
  {
    question: "Apakah saya bisa membatalkan pesanan atau refund tiket?",
    answer:
      "Maaf, semua pembelian tiket bersifat final dan tidak dapat dikembalikan (no-refund policy). Pembatalan hanya dapat dilakukan sebelum pembayaran diselesaikan. Setelah e-tiket diterbitkan, pembatalan dan pengembalian dana tidak dapat diproses.",
  },
  {
    question:
      "Bagaimana jika saya tidak menerima email konfirmasi atau e-tiket?",
    answer:
      "Periksa folder spam/junk di email Anda terlebih dahulu. Jika masih tidak ditemukan, hubungi kami melalui WhatsApp atau email dengan menyertakan nama lengkap dan nomor WhatsApp yang Anda gunakan saat pemesanan. Tim kami akan segera membantu Anda.",
  },
  {
    question: "Apakah e-tiket bisa digunakan oleh orang lain?",
    answer:
      "E-tiket bersifat personal dan harus sesuai dengan nama pemesan. Namun, jika Anda ingin memberikan tiket kepada orang lain, silakan hubungi tim kami untuk proses konfirmasi perubahan nama pemegang tiket (bila memungkinkan).",
  },
  {
    question: "Apa yang harus saya bawa saat menonton pertunjukan?",
    answer:
      "Anda wajib membawa e-tiket (dalam bentuk digital di smartphone atau print-out) dan identitas diri (KTP/SIM/Kartu Pelajar) yang sesuai dengan nama pemesan. Tunjukkan e-tiket saat memasuki venue.",
  },
  {
    question: "Apakah ada dress code untuk menonton pertunjukan?",
    answer:
      "Tidak ada dress code khusus, namun kami menyarankan untuk berpakaian sopan dan nyaman. Hindari menggunakan pakaian yang terlalu kasual seperti sandal jepit atau kaos oblong.",
  },
  {
    question: "Bagaimana jika pertunjukan dibatalkan atau dijadwalkan ulang?",
    answer:
      "Jika pertunjukan dibatalkan oleh pihak LTC Indonesia, pengembalian dana 100% akan diproses dalam waktu 14 hari kerja. Untuk penjadwalan ulang, tiket Anda tetap berlaku untuk jadwal baru dan kami akan menginformasikan melalui email.",
  },
  {
    question: "Apakah saya perlu membuat akun untuk memesan tiket?",
    answer:
      "Tidak perlu. Sistem kami menggunakan guest checkout, sehingga Anda tidak perlu registrasi atau membuat akun. Cukup isi formulir pemesanan dengan data diri Anda dan selesaikan pembayaran.",
  },
  {
    question: "Bagaimana cara menghubungi customer service?",
    answer:
      "Anda dapat menghubungi kami melalui WhatsApp di +62 852-2526-0146 (jam operasional 09.00-17.00 WIB) atau email ke ltc.indonesia26@gmail.com. Kami akan merespons dalam waktu 1x24 jam pada hari kerja.",
  },
];

export default function PusatBantuanPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        icon={<HelpCircle className="h-12 w-12 text-orange-500" />}
        title={<>Pusat <span className="text-orange-500">Bantuan</span></>}
        description="Temukan jawaban atas pertanyaan yang sering diajukan"
        maxWidth="4xl"
      />

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-zinc-50"
                >
                  <span className="pr-4 font-semibold text-zinc-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-orange-500 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="border-t border-zinc-200 bg-zinc-50 p-5 text-zinc-700">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900">
            Masih Butuh Bantuan?
          </h2>
          <p className="mb-6 text-zinc-600">
            Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk
            menghubungi tim kami melalui saluran berikut:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* WhatsApp */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900">WhatsApp</h3>
              <p className="mb-3 text-sm text-zinc-600">
                Hubungi kami via WhatsApp untuk respon cepat
              </p>
              <a
                href="https://wa.me/6285225260146"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline"
              >
                +62 852-2526-0146
              </a>
              <p className="mt-2 text-xs text-zinc-500">
                Jam operasional: 09.00 - 17.00 WIB
              </p>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900">Email</h3>
              <p className="mb-3 text-sm text-zinc-600">
                Kirim email untuk pertanyaan detail
              </p>
              <a
                href="mailto:ltc.indonesia26@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
              >
                ltc.indonesia26@gmail.com
              </a>
              <p className="mt-2 text-xs text-zinc-500">
                Respon dalam 1x24 jam (hari kerja)
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Phone className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900">Telepon</h3>
              <p className="mb-3 text-sm text-zinc-600">
                Hubungi kami via telepon untuk bantuan langsung
              </p>
              <a
                href="tel:+6208829111581"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:underline"
              >
                0882-9111-5815
              </a>
              <p className="mt-2 text-xs text-zinc-500">
                Senin - Jumat, 09.00 - 17.00 WIB
              </p>
            </div>

            {/* Office */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900">
                Kantor Kami
              </h3>
              <p className="mb-3 text-sm text-zinc-600">
                Kunjungi kantor kami untuk bantuan langsung
              </p>
              <p className="text-sm font-semibold text-purple-600">
                Sinar Pamulang Blok B9 No 9
              </p>
              <p className="text-sm text-zinc-600">
                Pamulang Barat, Tangerang Selatan, Banten 15417
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 rounded-2xl border border-orange-200 bg-orange-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-orange-900">
            Tautan Berguna
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cara-pesan-tiket"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100"
            >
              Cara Pesan Tiket
            </Link>
            <Link
              href="/syarat-ketentuan"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              href="/tiket"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100"
            >
              Lihat Jadwal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
