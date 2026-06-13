"use client";

import { X, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    description: string | null;
    posterUrl: string | null;
    showDate: Date;
    tickets: Array<{
      id: string;
      categoryName: string;
      price: number;
      stockQuota: number;
    }>;
  };
}

export default function EventDetailModal({
  isOpen,
  onClose,
  event,
}: EventDetailModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format date and time
  const eventDate = new Date(event.showDate);
  const dateStr = eventDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = eventDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get min price
  const minPrice =
    event.tickets.length > 0
      ? Math.min(...event.tickets.map((t) => t.price))
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[85vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg transition-all hover:bg-white cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Scrollable Content Area */}
        <div className="hide-scrollbar flex-1 w-full overflow-y-auto">
          {/* Poster Image */}
          {event.posterUrl ? (
            <div className="relative h-64 w-full overflow-hidden rounded-t-3xl bg-zinc-100 md:h-96">
              <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
              <div className="absolute inset-0 bg-linear-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-t-3xl bg-linear-gradient-to-br from-orange-100 to-orange-200 md:h-96">
              <Ticket className="h-32 w-32 text-orange-500" />
            </div>
          )}

          {/* Content */}
          <div className="p-4 md:p-8">
            {/* Title */}
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 md:text-4xl">
              {event.title}
            </h2>

            {/* Event Details */}
            <div className="mt-6 space-y-4">
              {/* Date */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <Calendar className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-500">Tanggal</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">
                    {dateStr}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-500">Waktu</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">
                    {timeStr} WIB
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <MapPin className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-500">Lokasi</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">
                    LTC Indonesia
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-zinc-950">Sinopsis</h3>
                <p className="mt-3 leading-relaxed text-zinc-700">
                  {event.description}
                </p>
              </div>
            )}

            {/* Ticket Categories */}
            {event.tickets.length > 0 && (
              <div className="mt-8 pb-4">
                <h3 className="text-xl font-bold text-zinc-950">
                  Kategori Tiket
                </h3>
                <div className="mt-4 space-y-3">
                  {event.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {ticket.categoryName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Stok: {ticket.stockQuota}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-orange-500 md:text-xl">
                        Rp {ticket.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Action Section */}
        <div className="sticky bottom-0 z-50 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 bg-white p-4 sm:flex-row sm:gap-4">
          <div>
            <p className="text-xs text-zinc-500 sm:text-sm">Harga mulai dari</p>
            <p className="text-xl font-bold text-orange-500 sm:text-2xl md:text-3xl">
              Rp {minPrice.toLocaleString("id-ID")}
            </p>
          </div>
          <Link
            href={`/checkout/${event.id}`}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4"
          >
            <Ticket className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Beli Tiket Sekarang</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
