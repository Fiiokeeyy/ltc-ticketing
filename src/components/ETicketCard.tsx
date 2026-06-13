"use client";

import {
  Printer,
  Calendar,
  Clock,
  MapPin,
  User,
  Ticket,
  CheckCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ETicketCardProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  eventTitle: string;
  eventDate: Date;
  ticketCategory: string;
  ticketQuantity: number;
  totalAmount: number;
  createdAt: Date;
}

export default function ETicketCard({
  orderId,
  customerName,
  customerEmail,
  eventTitle,
  eventDate,
  ticketCategory,
  ticketQuantity,
  totalAmount,
}: ETicketCardProps) {
  const handlePrint = () => {
    window.print();
  };

  // Format dates
  const showDate = new Date(eventDate);
  const dateStr = showDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = showDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 print:max-w-none print:px-0">
      {/* Print Button - Hidden when printing */}
      <div className="mb-6 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl cursor-pointer"
        >
          <Printer className="h-5 w-5" />
          Cetak / Simpan PDF
        </button>
      </div>

      <div className="space-y-8">
        {Array.from({ length: ticketQuantity }).map((_, index) => (
          <div
            key={`${orderId}-${index}`}
            className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl print:mb-12 print:flex print:flex-row print:break-inside-avoid print:break-after-page print:shadow-none md:flex-row"
          >
            {/* Left/Main Section */}
            <div className="flex flex-1 flex-col">
              {/* Header - Orange Gradient */}
              <div className="relative overflow-hidden bg-linear-to-br from-orange-500 to-orange-600 px-6 py-6 text-white">
                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-orange-100" />
                      <span className="text-sm font-medium text-orange-100">
                        LTC Indonesia
                      </span>
                    </div>
                    <h1 className="line-clamp-2 text-2xl font-extrabold md:text-3xl">
                      {eventTitle}
                    </h1>
                  </div>

                  {/* Verified Badge */}
                  <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1.5 text-green-50 backdrop-blur-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-bold tracking-wider">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details Content */}
              <div className="flex flex-1 flex-col justify-between space-y-6 p-6">
                {/* Grid Info */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Date */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Calendar className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Tanggal Pertunjukan
                      </p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {dateStr}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Waktu</p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {timeStr} WIB
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <MapPin className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Lokasi
                      </p>
                      <p className="line-clamp-1 text-sm font-semibold text-zinc-900">
                        LTC Indonesia
                      </p>
                      <p className="line-clamp-1 text-xs text-zinc-600">
                        Jl. Ir. H. Juanda No.95, Ciputat
                      </p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <User className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Pemegang Tiket
                      </p>
                      <p className="line-clamp-1 text-sm font-semibold text-zinc-900">
                        {customerName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Order Information */}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="mb-3 text-xs font-bold text-zinc-900">
                      Informasi Pesanan
                    </h3>
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-600">Email</span>
                        <span className="break-all text-xs font-medium text-zinc-900">
                          {customerEmail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
                        <span className="text-xs text-zinc-600">Total</span>
                        <span className="text-xs font-bold text-orange-500">
                          Rp {totalAmount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="rounded-xl bg-blue-50 p-4 print:break-inside-avoid">
                    <h4 className="mb-2 flex items-center gap-1 text-xs font-bold text-blue-900">
                      📌 Petunjuk:
                    </h4>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Siapkan e-tiket ini kepada petugas</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>QR Code hanya berlaku untuk 1x scan</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Footer Left */}
                <div className="border-t border-zinc-200 pt-4 text-center">
                  <p className="text-xs text-zinc-500">
                    © 2026 LTC Indonesia. All rights reserved.
                  </p>
                </div>
              </div>
            </div>

            {/* Separator - Vertical on Desktop/Print, Horizontal on Mobile */}
            <div className="relative flex items-center justify-center bg-white print:w-8 print:flex-col md:w-8 md:flex-col">
              {/* Horizontal Notches & Line (Mobile) */}
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-50 print:hidden md:hidden"></div>
              <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-50 print:hidden md:hidden"></div>
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-zinc-300 print:hidden md:hidden"></div>

              {/* Vertical Notches & Line (Desktop/Print) */}
              <div className="absolute -top-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-zinc-50 print:block md:block"></div>
              <div className="absolute -bottom-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-zinc-50 print:block md:block"></div>
              <div className="absolute inset-y-0 left-1/2 hidden border-l-2 border-dashed border-zinc-300 print:block md:block"></div>
            </div>

            {/* Right/Stub Section */}
            <div className="flex w-full shrink-0 flex-col items-center justify-center bg-zinc-50 p-6 print:w-64 md:w-64">
              <div className="mb-4 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Kategori
                </p>
                <p className="text-xl font-black text-orange-600">
                  {ticketCategory}
                </p>
                <p className="mt-1 text-xs font-semibold text-zinc-500">
                  Tiket {index + 1} dari {ticketQuantity}
                </p>
              </div>

              <div className="mb-4 rounded-xl border-2 border-white bg-white p-3 shadow-sm">
                <QRCodeSVG value={`${orderId}-${index + 1}`} size={120} />
              </div>

              <div className="w-full text-center">
                <p className="mb-1 text-[10px] font-semibold uppercase text-zinc-500">
                  Order ID
                </p>
                <p className="rounded bg-zinc-200/50 px-2 py-1 font-mono text-xs font-bold text-zinc-900">
                  {orderId.slice(0, 8).toUpperCase()}-{index + 1}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Print Instructions - Hidden when printing */}
      <div className="mt-6 rounded-xl bg-white p-6 text-center shadow-lg print:hidden">
        <p className="text-sm text-zinc-600">
          💡 <strong>Tips:</strong> Gunakan fitur &quot;Cetak&quot; browser Anda
          dan pilih &quot;Simpan sebagai PDF&quot; untuk menyimpan e-tiket ini
          secara offline. Saat mencetak, pastikan margin kertas diatur dengan
          baik.
        </p>
      </div>
    </div>
  );
}
