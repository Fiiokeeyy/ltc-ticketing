import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ETicketNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">
          Tiket Tidak Ditemukan
        </h1>
        <p className="mb-6 text-zinc-600">
          ID tiket yang Anda cari tidak ditemukan. Periksa kembali link yang
          Anda terima di email.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
