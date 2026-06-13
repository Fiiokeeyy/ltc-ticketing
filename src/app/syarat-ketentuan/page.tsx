import { Metadata } from "next";
import { FileText, AlertCircle } from "lucide-react";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan - LTC Indonesia",
  description: "Syarat dan ketentuan pemesanan tiket LTC Indonesia",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        icon={<FileText className="h-12 w-12 text-orange-500" />}
        title={<>Syarat & <span className="text-orange-500">Ketentuan</span></>}
        description="Harap baca dengan teliti sebelum melakukan pemesanan tiket"
        maxWidth="4xl"
      />

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Last Updated */}
        <div className="mb-8 rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
          <strong>Terakhir diperbarui:</strong> Juni 2026
        </div>

        {/* Content */}
        <div className="prose prose-zinc max-w-none">
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              1. Ketentuan Umum
            </h2>
            <div className="space-y-3 text-zinc-700">
              <p>
                Dengan mengakses dan menggunakan platform pemesanan tiket LTC
                Indonesia, Anda setuju untuk terikat dengan syarat dan ketentuan
                berikut:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Platform ini hanya digunakan untuk pemesanan tiket pertunjukan
                  teater yang diselenggarakan oleh LTC Indonesia.
                </li>
                <li>
                  Informasi yang Anda berikan harus akurat, lengkap, dan
                  terkini.
                </li>
                <li>
                  Anda bertanggung jawab penuh atas kerahasiaan data pribadi dan
                  transaksi Anda.
                </li>
                <li>
                  LTC Indonesia berhak menolak atau membatalkan pesanan yang
                  dianggap mencurigakan atau melanggar ketentuan.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              2. Pemesanan dan Pembayaran
            </h2>
            <div className="space-y-3 text-zinc-700">
              <p>Prosedur pemesanan dan pembayaran:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Pemesanan tiket dilakukan melalui sistem guest checkout (tidak
                  memerlukan registrasi akun).
                </li>
                <li>
                  Pembayaran harus diselesaikan dalam waktu{" "}
                  <strong>24 jam</strong> setelah pesanan dibuat. Pesanan akan
                  otomatis dibatalkan jika melewati batas waktu.
                </li>
                <li>
                  Metode pembayaran yang tersedia: Transfer Bank (myBCA, blu,
                  Superbank) dan QRIS.
                </li>
                <li>
                  Bukti pembayaran wajib diunggah melalui platform untuk proses
                  verifikasi.
                </li>
                <li>
                  Harga tiket yang tertera sudah final dan tidak termasuk biaya
                  admin transfer bank (jika ada).
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              3. Verifikasi dan Pengiriman E-Tiket
            </h2>
            <div className="space-y-3 text-zinc-700">
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Setelah bukti pembayaran diunggah, tim kami akan memverifikasi
                  dalam waktu maksimal <strong>1x24 jam</strong> (hari kerja).
                </li>
                <li>
                  E-tiket akan dikirim ke alamat email yang Anda daftarkan
                  setelah pembayaran terverifikasi.
                </li>
                <li>
                  Pastikan email yang Anda berikan aktif dan benar. LTC
                  Indonesia tidak bertanggung jawab atas kesalahan email yang
                  diinput oleh pembeli.
                </li>
                <li>
                  E-tiket yang dikirim bersifat personal dan tidak dapat
                  dipindahtangankan tanpa konfirmasi tertulis.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              4. Kebijakan Pembatalan dan Pengembalian Dana
            </h2>
            <div className="space-y-3 text-zinc-700">
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <p className="flex items-start gap-2 font-semibold text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    PENTING: Semua pembelian tiket bersifat final dan tidak
                    dapat dikembalikan (no-refund policy).
                  </span>
                </p>
              </div>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Pembatalan hanya dapat dilakukan sebelum pembayaran dilakukan
                  (status: pending_payment).
                </li>
                <li>
                  Setelah pembayaran terverifikasi dan e-tiket diterbitkan,
                  pembatalan tidak dapat diproses.
                </li>
                <li>
                  Tidak ada pengembalian dana untuk pertunjukan yang sudah
                  berlangsung atau tiket yang tidak digunakan.
                </li>
                <li>
                  Dalam hal pertunjukan dibatalkan oleh pihak LTC Indonesia,
                  pengembalian dana 100% akan diproses dalam waktu 14 hari
                  kerja.
                </li>
                <li>
                  Perubahan jadwal pertunjukan tidak termasuk dalam kebijakan
                  pengembalian dana. Tiket tetap berlaku untuk jadwal baru.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              5. Ketentuan Penggunaan E-Tiket
            </h2>
            <div className="space-y-3 text-zinc-700">
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  E-tiket wajib ditunjukkan (dalam bentuk digital atau cetak)
                  saat memasuki venue pertunjukan.
                </li>
                <li>
                  Setiap e-tiket memiliki kode unik dan hanya berlaku untuk satu
                  kali masuk.
                </li>
                <li>
                  Duplikasi, pemalsuan, atau penyalahgunaan e-tiket dapat
                  berakibat pada penolakan masuk tanpa pengembalian dana.
                </li>
                <li>
                  Pemegang tiket wajib mengikuti tata tertib venue dan aturan
                  yang ditetapkan panitia pertunjukan.
                </li>
                <li>
                  LTC Indonesia berhak menolak masuk bagi siapa pun yang tidak
                  mematuhi aturan atau mengganggu jalannya pertunjukan.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              6. Privasi dan Keamanan Data
            </h2>
            <div className="space-y-3 text-zinc-700">
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Data pribadi yang Anda berikan akan digunakan hanya untuk
                  keperluan pemrosesan pesanan dan komunikasi terkait
                  pertunjukan.
                </li>
                <li>
                  LTC Indonesia berkomitmen untuk menjaga kerahasiaan data Anda
                  dan tidak akan membagikannya kepada pihak ketiga tanpa izin.
                </li>
                <li>
                  Kami menggunakan sistem keamanan standar industri untuk
                  melindungi informasi Anda.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              7. Tanggung Jawab dan Batasan
            </h2>
            <div className="space-y-3 text-zinc-700">
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  LTC Indonesia tidak bertanggung jawab atas kerugian pribadi,
                  cedera, atau kehilangan barang selama pertunjukan.
                </li>
                <li>
                  Kami tidak bertanggung jawab atas gangguan teknis, termasuk
                  namun tidak terbatas pada kegagalan server, koneksi internet,
                  atau masalah email.
                </li>
                <li>
                  Force majeure (bencana alam, pandemi, keadaan darurat) dapat
                  mengakibatkan pembatalan atau penundaan pertunjukan. Kebijakan
                  khusus akan diinformasikan jika terjadi kondisi tersebut.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              8. Perubahan Syarat dan Ketentuan
            </h2>
            <div className="space-y-3 text-zinc-700">
              <p>
                LTC Indonesia berhak untuk mengubah, memodifikasi, atau
                memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa
                pemberitahuan sebelumnya. Perubahan akan berlaku efektif setelah
                dipublikasikan di halaman ini. Anda disarankan untuk memeriksa
                halaman ini secara berkala.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              9. Kontak dan Bantuan
            </h2>
            <div className="space-y-3 text-zinc-700">
              <p>
                Jika Anda memiliki pertanyaan atau memerlukan bantuan terkait
                syarat dan ketentuan ini, silakan hubungi kami melalui:
              </p>
              <div className="ml-6 space-y-1">
                <p>
                  <strong>Email:</strong> ltc.indonesia26@gmail.com
                </p>
                <p>
                  <strong>WhatsApp:</strong> +62 852-2526-0146
                </p>
                <p>
                  <strong>Telepon:</strong> 0882-9111-5815
                </p>
                <p>
                  <strong>Alamat:</strong> Sinar Pamulang Blok B9 No 9, Pamulang Barat,
                  Tangerang Selatan, Banten 15417
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Agreement Box */}
        <div className="mt-12 rounded-2xl border border-orange-200 bg-orange-50 p-6">
          <p className="text-center text-sm text-orange-800">
            Dengan melakukan pemesanan tiket, Anda menyatakan telah membaca,
            memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
          </p>
        </div>
      </div>
    </div>
  );
}
