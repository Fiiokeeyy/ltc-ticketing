"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { verifyTicket, ScanResult } from "@/actions/scanActions";
import {
  CheckCircle,
  XCircle,
  Search,
  ScanLine,
  Camera,
  User,
  Tag,
  Ticket,
  Hash,
} from "lucide-react";
import AdminHeroSection from "@/components/admin/AdminHeroSection";
import MobileMenuButtonWrapper from "@/components/admin/MobileMenuButtonWrapper";

// Lazy-load scanner to avoid SSR issues (requires browser camera API)
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false }
);

export default function ScannerPage() {
  const [manualId, setManualId] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const handleScan = async (qrValue: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setScanResult(null);
    const result = await verifyTicket(qrValue);
    setScanResult(result);
    setIsProcessing(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    handleScan(manualId.trim());
    setManualId("");
  };

  const handleReset = () => {
    setScanResult(null);
    setManualId("");
  };

  return (
    <div className="flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
      {/* Hero Section */}
      <AdminHeroSection
        title="Scan Tiket (Gate)"
        description="Verifikasi E-Tiket pengunjung di hari pementasan secara real-time"
      />

      {/* Mobile Menu Button */}
      <MobileMenuButtonWrapper />

      {/* Content */}
      <div className="space-y-6 p-4 md:p-8 w-full max-w-full min-w-0">
        <div className="grid gap-6 lg:grid-cols-2 w-full max-w-full min-w-0">
          
          {/* Left Column: Scanner */}
          <div className="space-y-4 w-full max-w-full min-w-0">
            {/* Camera Toggle Header */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm w-full">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <Camera className="h-5 w-5 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-zinc-900">Pemindai Kamera</h2>
                  <p className="truncate text-xs text-zinc-500">Arahkan kamera ke QR Code E-Tiket</p>
                </div>
              </div>
              <button
                onClick={() => setIsCameraActive((v) => !v)}
                className={`shrink-0 ml-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isCameraActive
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
              >
                {isCameraActive ? "Matikan" : "Nyalakan"}
              </button>
            </div>

            {/* Camera View */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-100 shadow-sm aspect-square">
              {isCameraActive ? (
                <>
                  <Scanner
                    onScan={(result) => handleScan(result[0].rawValue)}
                    sound={true}
                    constraints={{ facingMode: "environment" }}
                    components={{ torch: true, finder: true }}
                    styles={{ container: { width: "100%", height: "100%" } }}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
                        <p className="text-sm font-semibold text-zinc-700">Memverifikasi...</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-400">
                  <Camera className="h-16 w-16 opacity-30" />
                  <p className="text-sm font-medium">Kamera dimatikan</p>
                </div>
              )}
            </div>

            {/* Manual Input */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm w-full">
              <h3 className="mb-3 text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <ScanLine className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="truncate">Input Manual (Jika Kamera Rusak)</span>
              </h3>
              <form onSubmit={handleManualSubmit} className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Ketik atau tempel ID Tiket..."
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="flex-1 min-w-0 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Cek ID Manual"
                  disabled={isProcessing || !manualId.trim()}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  Cek
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Result Panel */}
          <div className="space-y-4 w-full max-w-full min-w-0">
            {/* Result Header */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm w-full">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <Ticket className="h-5 w-5 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-zinc-900">Hasil Verifikasi</h2>
                  <p className="truncate text-xs text-zinc-500">Hasil scan tiket ditampilkan di sini</p>
                </div>
              </div>
              {scanResult && (
                <button
                  onClick={handleReset}
                  className="shrink-0 ml-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Result Card */}
            {!scanResult ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center">
                <ScanLine className="h-16 w-16 text-zinc-300" />
                <h3 className="mt-4 text-base font-semibold text-zinc-500">Menunggu Scan</h3>
                <p className="mt-1 text-sm text-zinc-400">Arahkan kamera ke QR Code atau input ID tiket secara manual</p>
              </div>
            ) : scanResult.success ? (
              <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-green-700 tracking-tight">DIIZINKAN MASUK</h2>
                    <p className="mt-1 text-sm text-green-600">Tiket Valid & Pembayaran Terverifikasi</p>
                  </div>
                </div>

                {scanResult.data && (
                  <div className="mt-6 space-y-3">
                    <InfoRow icon={<User className="h-4 w-4 text-green-600" />} label="Nama Penonton" value={scanResult.data.customerName} />
                    <InfoRow icon={<Tag className="h-4 w-4 text-green-600" />} label="Event" value={scanResult.data.eventTitle} />
                    <InfoRow icon={<Ticket className="h-4 w-4 text-green-600" />} label="Kategori Tiket" value={scanResult.data.ticketCategory} highlight />
                    <InfoRow icon={<Hash className="h-4 w-4 text-green-600" />} label="Nomor Tiket" value={`Tiket ke-${scanResult.data.ticketIndex} dari ${scanResult.data.ticketQuantity}`} />
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="mt-6 w-full rounded-xl bg-green-500 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Scan Tiket Berikutnya
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-lg">
                    <XCircle className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-red-700 tracking-tight">AKSES DITOLAK</h2>
                    <p className="mt-2 font-medium text-red-600">{scanResult.message}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-6 w-full rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for the result info rows
function InfoRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-white p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className={`truncate text-sm font-semibold ${highlight ? "text-orange-600" : "text-zinc-900"}`}>{value}</p>
      </div>
    </div>
  );
}
