"use client";

import { X, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

//Types
interface TicketCategory {
  id: string;
  categoryName: string;
  price: number;
  stockQuota: number;
}
interface Event {
  id: string;
  title: string;
  description: string | null;
  posterUrl: string | null;
  showDate: Date;
  tickets: TicketCategory[];
}
interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

//Animation phase
type AnimPhase = "unmounted" | "entering" | "entered" | "exiting";

//Custom hook
function useModalAnimation(isOpen: boolean) {
  const [phase, setPhase] = useState<AnimPhase>("unmounted");

  //Scroll-lock
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Animation phase transitions — all setState in async callbacks.
  useEffect(() => {
    let raf1: number;
    let raf2: number;
    let timer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      raf1 = requestAnimationFrame(() => {
        setPhase("entering");
        raf2 = requestAnimationFrame(() => setPhase("entered"));
      });
    } else {
      raf1 = requestAnimationFrame(() => setPhase("exiting"));
      timer = setTimeout(() => setPhase("unmounted"), 310);
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
      }
      void e;
    };
    return () => void handleEsc;
  }, [isOpen]);

  const isIn = phase === "entered";
  const isMounted = phase !== "unmounted";

  return { phase, isIn, isMounted };
}

export default function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  const { isIn, isMounted } = useModalAnimation(isOpen);

  // ESC key — kept here so onClose is in scope without stale closure issues
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  // Derived display values
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
  const minPrice = event.tickets.length > 0
    ? Math.min(...event.tickets.map((t) => t.price))
    : 0;

  // Animation styles
  const backdropStyle: React.CSSProperties = {
    transition: "opacity 300ms ease",
    opacity: isIn ? 1 : 0,
  };
  const mobileCardStyle: React.CSSProperties = {
    transition: "transform 300ms cubic-bezier(0.32,0.72,0,1), opacity 300ms ease",
    transform: isIn ? "translateY(0)" : "translateY(100%)",
    opacity: isIn ? 1 : 0,
    maxHeight: "92dvh",
  };
  const desktopCardStyle: React.CSSProperties = {
    transition: "transform 280ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease",
    transform: isIn ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)",
    opacity: isIn ? 1 : 0,
    maxHeight: "min(88vh, 700px)",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999"
      aria-modal="true"
      role="dialog"
      aria-label={event.title}
    >
      {/*Backdrop*/}
      <div
        className="absolute inset-0 cursor-pointer"
        style={backdropStyle}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
      </div>

      {/*Mobile card: bottom sheet*/}
      <div
        className="sm:hidden absolute bottom-0 left-0 right-0 z-10 flex flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)]"
        style={mobileCardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContent
          event={event}
          dateStr={dateStr}
          timeStr={timeStr}
          minPrice={minPrice}
          isMobile
          onClose={onClose}
        />
      </div>

      {/*Desktop card: centered dialog*/}
      <div className="hidden sm:flex absolute inset-0 items-center justify-center p-6 pointer-events-none">
        <div
          className="pointer-events-auto relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] w-full max-w-lg lg:max-w-xl"
          style={desktopCardStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContent
            event={event}
            dateStr={dateStr}
            timeStr={timeStr}
            minPrice={minPrice}
            isMobile={false}
            onClose={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

//Modal body — shared between mobile and desktop cards
interface ModalContentProps {
  event: Event;
  dateStr: string;
  timeStr: string;
  minPrice: number;
  isMobile: boolean;
  onClose: () => void;
}

function ModalContent({ event, dateStr, timeStr, minPrice, isMobile, onClose }: ModalContentProps) {
  return (
    <>
      {/* Drag handle — mobile only */}
      {isMobile && (
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-zinc-300" />
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Tutup modal"
        className="absolute right-3 top-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow-md ring-1 ring-black/5 transition-all hover:scale-110 hover:bg-white hover:text-zinc-900 active:scale-95"
      >
        <X className="h-4 w-4" />
      </button>

      {/*Scrollable body*/}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        {/* Poster */}
        {event.posterUrl ? (
          <div className="relative h-44 w-full shrink-0 overflow-hidden bg-zinc-100 sm:h-56">
            <Image
              src={event.posterUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 640px) 100vw, 576px"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8">
              <h2 className="text-xl font-extrabold leading-snug tracking-tight text-white drop-shadow-lg sm:text-2xl">
                {event.title}
              </h2>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-28 shrink-0 items-center justify-center bg-linear-to-br from-orange-50 to-orange-100 sm:h-36">
              <Ticket className="h-14 w-14 text-orange-300" />
            </div>
            <div className="px-5 pt-4 sm:px-6">
              <h2 className="text-xl font-extrabold leading-snug tracking-tight text-zinc-950 sm:text-2xl">
                {event.title}
              </h2>
            </div>
          </>
        )}

        {/* Content */}
        <div className="px-5 pb-4 pt-4 sm:px-6">
          {/* Spacer when title is overlaid on poster */}
          {event.posterUrl && <div className="mb-4" />}

          {/* Info rows */}
          <div className="grid grid-cols-1 gap-2.5">
            <InfoRow icon={<Calendar className="h-4 w-4 text-orange-500" />} label="Tanggal" value={dateStr} truncate />
            <InfoRow icon={<Clock className="h-4 w-4 text-orange-500" />}    label="Waktu"   value={`${timeStr} WIB`} />
            <InfoRow icon={<MapPin className="h-4 w-4 text-orange-500" />}   label="Lokasi"  value="LTC Indonesia" />
          </div>

          {/* Sinopsis */}
          {event.description && (
            <div className="mt-5">
              <SectionLabel>Sinopsis</SectionLabel>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{event.description}</p>
            </div>
          )}

          {/* Kategori Tiket */}
          {event.tickets.length > 0 && (
            <div className="mt-5 pb-2">
              <SectionLabel>Kategori Tiket</SectionLabel>
              <div className="mt-3 space-y-2">
                {event.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 transition-colors hover:border-orange-100 hover:bg-orange-50/50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{ticket.categoryName}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {ticket.stockQuota > 0 ? `${ticket.stockQuota} tiket tersedia` : "Habis terjual"}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-orange-500 sm:text-base">
                      Rp {ticket.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 flex items-center justify-between gap-3 border-t border-zinc-100 bg-white/95 px-5 py-3.5 backdrop-blur-sm sm:px-6 sm:py-4">
        {event.tickets.length > 0 ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Mulai dari</p>
            <p className="text-lg font-extrabold leading-tight text-orange-500">
              Rp {minPrice.toLocaleString("id-ID")}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">Tiket tidak tersedia</p>
        )}

        <Link
          href={`/checkout/${event.id}`}
          onClick={onClose}
          className="group shrink-0 flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-600/30 active:translate-y-0 active:scale-95 sm:px-6 sm:py-3"
        >
          <Ticket className="h-4 w-4 transition-transform group-hover:rotate-12" />
          <span>Beli Tiket</span>
        </Link>
      </div>
    </>
  );
}

//Sub-components
function InfoRow({
  icon,
  label,
  value,
  truncate = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
        <p className={`text-sm font-semibold text-zinc-800 ${truncate ? "truncate" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-1 rounded-full bg-orange-500" />
      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950">{children}</h3>
    </div>
  );
}
