<div align="center">
  <img src="public/ltc-logo.jpeg" alt="LTC Indonesia Logo" width="100" style="border-radius: 16px" />
  <h1>LTC Indonesia — E-Ticketing System</h1>
  <p>Platform pemesanan tiket pertunjukan teater resmi LTC Indonesia</p>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
  ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle&logoColor=black)
  ![Turso](https://img.shields.io/badge/Turso-LibSQL-4FF8D2?logo=turso&logoColor=black)
  ![Cloudinary](https://img.shields.io/badge/Cloudinary-1.64-1778F5?logo=cloudinary&logoColor=white)
  ![Vercel](https://img.shields.io/badge/Vercel-14.0.0-000000?logo=vercel&logoColor=white)
  

</div>

---

## 📖 Tentang Proyek

**LTC Indonesia E-Ticketing** adalah aplikasi web full-stack untuk pemesanan tiket pertunjukan teater secara online. Dibangun dengan teknologi modern, aplikasi ini menyediakan pengalaman yang mulus bagi pengunjung untuk memesan tiket, melakukan pembayaran, dan menerima e-tiket digital — serta panel admin yang lengkap dan sistem pemindaian tiket untuk petugas gate.

## ✨ Fitur Utama

### 🎭 Halaman Publik
- **Beranda** — Landing page dengan animasi scroll halus dan testimoni pengguna
- **Jadwal Pertunjukan** — Grid event yang dapat dijelajahi dengan detail lengkap
- **Pemesanan Tiket** — Checkout guest dengan fitur validasi ganda (Double Confirmation)
- **Ketersediaan Real-Time** — Kuota tiket akan otomatis berkurang saat dipesan dan kembali jika dibatalkan
- **Pembayaran** — Upload bukti transfer dengan Cloudinary; mendukung Transfer Bank & QRIS
- **E-Tiket Digital** — QR Code unik dikirim ke email setelah pembayaran terverifikasi
- **Notifikasi Otomatis** — Email otomatis terkirim jika pembayaran berhasil, dibatalkan, atau ditolak
- **Tulis Ulasan** — Pengunjung dapat memberikan testimoni setelah menonton
- **Cara Pesan Tiket** — Panduan langkah demi langkah
- **Pusat Bantuan** — FAQ lengkap dan informasi kontak
- **Syarat & Ketentuan** — Kebijakan platform

### 🛡️ Panel Admin
- **Dashboard Utama** — Statistik real-time: total transaksi, pendapatan, status pembayaran
- **Grafik Pendapatan** — Visualisasi data dengan Recharts (filter periode)
- **Kelola Transaksi** — Verifikasi/Tolak pembayaran, kirim notifikasi otomatis, dan filter status
- **Kelola Event** — CRUD event pertunjukan beserta manajemen kuota tiket dan harga per kategori
- **Kelola Ulasan** — Moderasi (approve/reject) testimoni pengunjung
- **Metode Pembayaran** — Konfigurasi rekening bank dan QRIS dinamis
- **Scan Tiket Gate** — Halaman pemindaian QR Code khusus Petugas Gate

### 🔐 Autentikasi & Keamanan
- Login berbasis database (Turso) dengan bcrypt password hashing
- JWT Token (HMAC-SHA256 via Web Crypto API) disimpan sebagai HttpOnly Cookie
- Role-Based Access Control (RBAC): **Admin** & **Gate**
- Middleware proteksi route — akun Gate hanya bisa akses halaman Scanner

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Bahasa** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | [Turso (LibSQL)](https://turso.tech/) — SQLite di edge |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Storage** | [Cloudinary](https://cloudinary.com/) — upload bukti bayar |
| **Email** | [Nodemailer](https://nodemailer.com/) + Gmail SMTP |
| **QR Code** | [qrcode.react](https://github.com/zpao/qrcode.react) & [@yudiel/react-qr-scanner](https://github.com/yudielcurbelo/react-qr-scanner) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Auth** | JWT (Web Crypto API) + bcryptjs |
| **Deploy** | [Vercel](https://vercel.com/) |

---

## 📁 Struktur Proyek

```text
ltc-ticketing/
├── src/
│   ├── actions/           # Server Actions untuk komunikasi client ke server (Next.js)
│   │   ├── adminActions.ts      # Aksi terkait statistik dashboard & pengelolaan admin
│   │   ├── authActions.ts       # Aksi autentikasi (login, logout, verifikasi password)
│   │   ├── eventActions.ts      # Aksi CRUD data event/pertunjukan teater
│   │   ├── paymentMethodActions.ts # Aksi mengelola metode pembayaran (Bank, QRIS)
│   │   ├── scanActions.ts       # Aksi untuk pemindaian dan validasi tiket di gate
│   │   ├── testimonialActions.ts# Aksi manajemen dan moderasi ulasan pengunjung
│   │   ├── transactionActions.ts# Aksi pemesanan, verifikasi & konfirmasi transaksi
│   │   └── uploadActions.ts     # Aksi upload file bukti pembayaran ke Cloudinary
│   ├── app/               # Next.js App Router (Halaman Aplikasi Utama)
│   │   ├── admin/         # Rute panel admin (dilindungi oleh middleware)
│   │   │   ├── (dashboard)/   # Layout group untuk tampilan dalam dashboard admin
│   │   │   │   ├── page.tsx       # Halaman utama admin (Statistik & Grafik)
│   │   │   │   ├── transactions/  # Halaman kelola transaksi pengunjung
│   │   │   │   ├── events/        # Halaman manajemen daftar pertunjukan
│   │   │   │   ├── testimonials/  # Halaman untuk setujui/tolak ulasan pengunjung
│   │   │   │   ├── payment-methods/ # Halaman pengaturan nomor rekening bank/QRIS
│   │   │   │   └── scanner/       # Halaman khusus petugas gate memindai QR tiket
│   │   │   └── login/         # Halaman login masuk untuk Admin dan petugas Gate
│   │   ├── api/           # Next.js Route Handlers (Endpoint API Backend)
│   │   │   ├── auth/      # API untuk autentikasi (login)
│   │   │   └── admin/     # API khusus akses data untuk admin
│   │   ├── tiket/         # Halaman daftar jadwal pertunjukan untuk pengunjung
│   │   ├── checkout/      # Halaman form pengisian data pemesanan pengunjung
│   │   ├── payment/       # Halaman upload bukti bayar & status pesanan
│   │   ├── e-tiket/       # Halaman untuk menampilkan e-tiket digital (QR Code)
│   │   ├── tulis-ulasan/  # Form khusus pengunjung untuk memberikan testimoninya
│   │   ├── cara-pesan-tiket/# Halaman informasi cara memesan tiket
│   │   ├── pusat-bantuan/ # Halaman FAQ (Pertanyaan Umum) dan kontak
│   │   └── syarat-ketentuan/# Halaman Syarat dan Ketentuan penggunaan aplikasi
│   ├── components/        # Komponen React yang dapat digunakan ulang (Reusable)
│   │   ├── admin/         # Komponen khusus panel Admin (Sidebar, Chart, dll)
│   │   └── modal/         # Komponen pop-up/modal (pesan sukses, konfirmasi hapus)
│   ├── db/                # Konfigurasi dan Skema Database Server (Turso & Drizzle)
│   │   ├── index.ts       # Inisialisasi koneksi klien database Drizzle ORM
│   │   └── schema.ts      # Definisi tabel database (tabel users, events, dll)
│   ├── lib/               # Utility dan Helper Functions
│   │   ├── auth.ts        # Helper utilitas verifikasi JWT dan proses enkripsi
│   │   ├── dateFilter.ts  # Helper fungsi pemformatan & penyaringan waktu/tanggal
│   │   └── email.ts       # Helper fungsionalitas email (Nodemailer otomatis)
│   └── proxy.ts           # Middleware Next.js untuk proteksi route & kontrol akses
├── public/                # Folder tempat aset statis publik (gambar, logo, font, dll)
├── drizzle/               # Folder hasil generate skema migrasi database Drizzle
├── drizzle.config.ts      # File konfigurasi Drizzle ORM terhadap Turso
├── next.config.ts         # File konfigurasi Next.js framework
├── tailwind.config.js     # File konfigurasi utility styling Tailwind CSS
└── package.json           # File manifest daftar package (dependencies & scripts) proyek
```

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- Node.js v20+
- npm
- Akun [Turso](https://turso.tech/) (gratis)
- Akun [Cloudinary](https://cloudinary.com/) (gratis)
- Gmail dengan App Password aktif

### 1. Clone & Install

```bash
git clone https://github.com/USERNAME/ltc-ticketing.git
cd ltc-ticketing
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Isi semua nilai di `.env.local` sesuai akun Anda (lihat bagian [Environment Variables](#-environment-variables)).

### 3. Push Schema ke Database

```bash
npx drizzle-kit push
```

### 4. Buat Akun Admin & Gate

Buat script seed atau masukkan data langsung ke Turso dashboard. Gunakan bcrypt hash untuk password.

### 5. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Buat file `.env.local` di root proyek. Konfigurasi yang dibutuhkan adalah sebagai berikut:

| Variable | Keterangan |
|---|---|
| `TURSO_CONNECTION_URL` | URL koneksi database Turso |
| `TURSO_AUTH_TOKEN` | Auth token dari dashboard Turso |
| `CLOUDINARY_CLOUD_NAME` | Nama cloud Cloudinary |
| `CLOUDINARY_API_KEY` | API Key Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary |
| `EMAIL_USER` | Alamat Gmail pengirim |
| `EMAIL_PASS` | Gmail App Password (bukan password biasa) |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi (contoh: `https://ltc.vercel.app`) |
| `JWT_SECRET` | String acak 64 karakter untuk signing JWT |

> ⚠️ **Jangan pernah commit file `.env.local`!** File ini sudah di-ignore oleh `.gitignore`.

---

## ☁️ Deploy ke Vercel

1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import repository
3. Di **Settings → Environment Variables**, tambahkan semua variabel lingkungan yang ada di tabel atas
4. Ubah `NEXT_PUBLIC_APP_URL` menjadi URL Vercel Anda
5. Klik **Deploy** ✅

---

## 🗄️ Database Schema

Tabel utama dalam database Turso:

| Tabel | Deskripsi |
|---|---|
| `users` | Admin & Gate accounts (dengan bcrypt password) |
| `events` | Data pertunjukan teater |
| `tickets` | Kategori tiket per event (harga, stok, dll) |
| `transactions` | Pesanan pengunjung, detail item/tiket, & status pembayaran |
| `payment_methods` | Konfigurasi rekening & QRIS aktif |
| `testimonials` | Ulasan pengunjung (pending/approved/rejected) |

---

## 👥 Role Pengguna

| Role | Akses |
|---|---|
| **ADMIN** | Full access: dashboard, transaksi, event, ulasan, metode bayar, scanner |
| **GATE** | Hanya akses halaman Scanner untuk memindai QR tiket |
| **CUSTOMER** | Pengunjung biasa (pemesanan tanpa login) |

---

## 📞 Kontak

**LTC Indonesia**  
📍 Sinar Pamulang Blok B9 No 9, Pamulang Barat, Tangerang Selatan, Banten 15417  
💬 WhatsApp: +62 852-2526-0146  
📞 Telepon: 0882-9111-5815  
📧 Email: ltc.indonesia26@gmail.com

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk LTC Indonesia</p>
</div>
