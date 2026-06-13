"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import Image from "next/image";
import EventDetailModal from "./EventDetailModal";

interface Event {
  id: string;
  title: string;
  description: string | null;
  posterUrl: string | null;
  showDate: Date;
  createdAt: Date;
  tickets: Array<{
    id: string;
    eventId: string;
    categoryName: string;
    price: number;
    stockQuota: number;
  }>;
}

interface EventsGridProps {
  events: Event[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-12 text-center">
        <Ticket className="mx-auto mb-4 h-16 w-16 text-zinc-400" />
        <h3 className="text-xl font-semibold text-zinc-900">
          Belum Ada Pertunjukan
        </h3>
        <p className="mt-2 text-zinc-600">
          Saat ini belum ada jadwal pertunjukan yang tersedia. Silakan cek
          kembali nanti.
        </p>
      </div>
    );
  }

  // Split events into two rows for mobile
  const half = Math.ceil(events.length / 2);
  const topRow = events.slice(0, half);
  const bottomRow = events.slice(half);

  // Render card function
  const renderCard = (event: Event) => {
    // Get the cheapest ticket price
    const minPrice =
      event.tickets.length > 0
        ? Math.min(...event.tickets.map((t) => t.price))
        : 0;

    // Format date
    const eventDate = new Date(event.showDate);
    const dateStr = eventDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = eventDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div
        key={event.id}
        onClick={() => setSelectedEvent(event)}
        className="flex h-full w-full cursor-pointer snap-start flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-transform hover:scale-[1.02]"
      >
        {/* Event Poster */}
        {event.posterUrl ? (
          <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100 md:aspect-video">
            <Image
              src={event.posterUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 75vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
            />
          </div>
        ) : (
          <div className="flex aspect-4/3 w-full items-center justify-center bg-linear-to-br from-orange-100 to-orange-200 md:aspect-video">
            <Ticket className="h-12 w-12 text-orange-500 md:h-16 md:w-16" />
          </div>
        )}

        {/* Event Content */}
        <div className="flex flex-1 flex-col p-3 md:p-5">
          {/* Event Title */}
          <h2 className="line-clamp-2 text-sm font-bold leading-tight text-zinc-950 md:text-lg">
            {event.title}
          </h2>

          {/* Event Details */}
          <div className="mt-2 space-y-1 md:mt-3 md:space-y-1.5">
            {/* Date */}
            <div className="flex items-center gap-1 md:gap-2">
              <Calendar className="h-3 w-3 shrink-0 text-orange-500 md:h-4 md:w-4" />
              <p className="text-[10px] font-medium text-zinc-700 md:text-xs lg:text-sm">
                {dateStr}
              </p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="h-3 w-3 shrink-0 text-orange-500 md:h-4 md:w-4" />
              <p className="text-[10px] font-medium text-zinc-700 md:text-xs lg:text-sm">
                {timeStr} WIB
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 md:gap-2">
              <MapPin className="h-3 w-3 shrink-0 text-orange-500 md:h-4 md:w-4" />
              <p className="text-[10px] font-medium text-zinc-700 md:text-xs lg:text-sm">
                LTC Indonesia
              </p>
            </div>
          </div>

          {/* Price & Button */}
          <div className="mt-auto flex flex-col gap-2 border-t border-zinc-200 pt-3 md:gap-3">
            <div>
              <p className="text-[10px] text-zinc-500 md:text-xs">Mulai dari</p>
              <p className="text-sm font-bold text-orange-500 md:text-lg">
                Rp {minPrice.toLocaleString("id-ID")}
              </p>
            </div>
            <button className="w-full rounded-lg bg-orange-500 px-2 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-600 md:px-4 md:py-2 md:text-sm cursor-pointer">
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Layout - Two Independent Scrollable Rows */}
      <div className="block space-y-4 md:hidden">
        {/* Top Row */}
        <div className="hide-scrollbar flex w-full gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {topRow.map((event) => (
            <div
              key={event.id}
              className="w-[75%] flex-none snap-start sm:w-[45%]"
            >
              {renderCard(event)}
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="hide-scrollbar flex w-full gap-4 overflow-x-auto snap-x snap-mandatory">
          {bottomRow.map((event) => (
            <div
              key={event.id}
              className="w-[75%] flex-none snap-start sm:w-[45%]"
            >
              {renderCard(event)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Standard Grid */}
      <div className="hidden w-full gap-6 md:grid md:grid-cols-3 lg:grid-cols-4">
        {events.map((event) => renderCard(event))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
        />
      )}
    </>
  );
}
