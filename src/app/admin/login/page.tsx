"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        if (data.role === "gate") {
          router.push("/admin/scanner");
        } else {
          router.push("/admin");
        }
        router.refresh();
      } else {
        setError(data.message || "Login gagal. Coba lagi.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background Image Full Screen */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/ltc-logo.jpeg"
          alt="Background LTC"
          fill
          className="object-cover opacity-40 blur-md"
          priority
        />
        {/* Dark Overlay untuk kesan elegan seperti Lapor Aman */}
        <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-[2px]" />
      </div>

      {/* Main Card Container (ditambahkan relative dan z-10 agar berada di atas background) */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-[4rem] border border-white/20 bg-white shadow-2xl md:flex-row">
        
        {/* Left Panel - Branding (Dark) */}
        <div className="flex flex-col items-center justify-center bg-zinc-900 p-10 text-center md:w-5/12 md:p-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
            <Image
              src="/ltc-logo.jpeg"
              alt="LTC Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white">
            Portal <span className="text-orange-500">Admin</span>
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            Kelola transaksi tiket, tinjau ulasan pengguna, dan pantau aktivitas penjualan melalui dashboard terintegrasi.
          </p>
          
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-xs font-semibold text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            AKSES TERBATAS
          </div>
        </div>

        {/* Right Panel - Login Form (Light) */}
        <div className="flex flex-col justify-center p-10 md:w-7/12 md:p-14">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">Login Staff</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Silakan masuk dengan akun Administrator Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-700"
              >
                Email / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="admin@ltc.id atau Admin LTC"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-700"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-12 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.username || !formData.password}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 font-bold text-white transition-all hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/20 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}