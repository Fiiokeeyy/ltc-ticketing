<div align="center">
  <img src="public/ltc-logo.jpeg" alt="LTC Indonesia Logo" width="100" style="border-radius: 16px" />
  <h1>LTC Indonesia — E-Ticketing System</h1>
  <p>Platform pemesanan tiket pertunjukan teater resmi LTC Indonesia</p>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
  ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle&logoColor=black)
  ![Turso](https://img.shields.io/badge/Turso-LibSQL-4FF8D2?logo=turso&logoColor=black)

</div>

---

## 📖 Tentang Proyek

**LTC Indonesia E-Ticketing** adalah aplikasi web full-stack untuk pemesanan tiket pertunjukan teater secara online. Dibangun dengan teknologi modern, aplikasi ini menyediakan pengalaman yang mulus bagi pengunjung untuk memesan tiket, melakukan pembayaran, dan menerima e-tiket digital — serta panel admin yang lengkap dan sistem pemindaian tiket untuk petugas gate.

## ✨ Fitur Utama

### 🎭 Halaman Publik
- **Beranda** — Landing page dengan animasi scroll halus dan testimoni pengguna
- **Jadwal Pertunjukan** — Grid event yang dapat dijelajahi dengan detail lengkap
- **Pemesanan Tiket** — Checkout guest (tanpa registrasi), pilih kategori dan jumlah tiket
- **Pembayaran** — Upload bukti transfer dengan Cloudinary; mendukung Transfer Bank & QRIS
- **E-Tiket Digital** — QR Code unik dikirim ke email setelah pembayaran terverifikasi
- **Tulis Ulasan** — Pengunjung dapat memberikan testimoni setelah menonton
- **Cara Pesan Tiket** — Panduan langkah demi langkah
- **Pusat Bantuan** — FAQ lengkap dan informasi kontak
- **Syarat & Ketentuan** — Kebijakan platform

### 🛡️ Panel Admin
- **Dashboard Utama** — Statistik real-time: total transaksi, pendapatan, status pembayaran
- **Grafik Pendapatan** — Visualisasi data dengan Recharts (filter periode)
- **Kelola Transaksi** — Verifikasi pembayaran, lihat bukti transfer, ekspor CSV
- **Kelola Event** — CRUD event pertunjukan beserta tiket per kategori
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

```
ltc-ticketing/
├── src/
│   ├── actions/           # Server Actions (Next.js)
│   │   ├── adminActions.ts
│   │   ├── authActions.ts
│   │   ├── eventActions.ts
│   │   ├── paymentMethodActions.ts
│   │   ├── scanActions.ts
│   │   ├── testimonialActions.ts
│   │   ├── transactionActions.ts
│   │   └── uploadActions.ts
│   ├── app/               # App Router pages
│   │   ├── admin/         # Panel admin (protected)
│   │   │   ├── (dashboard)/   # Dashboard layout group
│   │   │   │   ├── page.tsx       # Dashboard utama
│   │   │   │   ├── transactions/  # Kelola tiket
│   │   │   │   ├── events/        # Kelola event
│   │   │   │   ├── testimonials/  # Moderasi ulasan
│   │   │   │   ├── payment-methods/
│   │   │   │   └── scanner/       # Scan QR gate
│   │   │   └── login/
│   │   ├── api/           # API Routes
│   │   │   ├── auth/      # Login & logout
│   │   │   └── admin/     # Admin API endpoints
│   │   ├── tiket/         # Jadwal pertunjukan
│   │   ├── checkout/      # Form pemesanan
│   │   ├── payment/       # Upload bukti bayar
│   │   ├── e-tiket/       # Tampilan e-tiket digital
│   │   ├── tulis-ulasan/
│   │   ├── cara-pesan-tiket/
│   │   ├── pusat-bantuan/
│   │   └── syarat-ketentuan/
│   ├── components/        # Reusable UI components
│   │   ├── admin/         # Komponen khusus admin
│   │   └── modal/
│   ├── db/
│   │   ├── index.ts       # Drizzle client
│   │   └── schema.ts      # Database schema
│   ├── lib/
│   │   ├── auth.ts        # JWT utilities
│   │   ├── dateFilter.ts
│   │   └── email.ts       # Nodemailer helper
│   └── proxy.ts           # Middleware (route guard + RBAC)
├── drizzle/               # Generated migration files
├── .env.example           # Template environment variables
└── drizzle.config.ts
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

Buat file `.env.local` di root proyek. Lihat [`.env.example`](.env.example) untuk template lengkap.

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
3. Di **Settings → Environment Variables**, tambahkan semua variabel dari `.env.example`
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
| `transactions` | Pesanan pengunjung + status pembayaran |
| `order_items` | Detail item dalam setiap transaksi |
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
