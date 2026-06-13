import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function PaymentNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-zinc-900">
          Transaksi Tidak Ditemukan
        </h1>
        <p className="mb-8 text-zinc-600">
          Maaf, transaksi yang Anda cari tidak ditemukan. Pastikan link
          pembayaran yang Anda gunakan sudah benar.
        </p>
        <Link
          href="/tiket"
          className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Kembali ke Jadwal
        </Link>
      </div>
    </div>
  );
}
