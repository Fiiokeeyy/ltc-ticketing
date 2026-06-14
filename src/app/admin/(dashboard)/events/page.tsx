import { db } from "@/db";
import { events, tickets } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Calendar, Clock, Ticket, Tag } from "lucide-react";
import Image from "next/image";
import AdminHeroSection from "@/components/admin/AdminHeroSection";
import MobileMenuButtonWrapper from "@/components/admin/MobileMenuButtonWrapper";
import AddEventModal from "@/components/admin/AddEventModal";
import DeleteEventButton from "@/components/admin/DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  // Fetch events and tickets separately
  const rawEvents = await db.select().from(events).orderBy(desc(events.createdAt));
  const rawTickets = await db.select().from(tickets);

  // Map them together
  const allEvents = rawEvents.map((event) => {
    const eventTickets = rawTickets.filter((t) => t.eventId === event.id);
    const lowestPrice =
      eventTickets.length > 0
        ? Math.min(...eventTickets.map((t) => t.price))
        : 0;
    const ticketCount = eventTickets.length;

    return {
      event,
      eventTickets,
      lowestPrice,
      ticketCount,
    };
  });

  return (
    <div>
      {/* Hero Section */}
      <AdminHeroSection
        title="Kelola Event"
        description="Kelola daftar pertunjukan teater LTC Indonesia beserta kategori tiketnya"
      />

      {/* Mobile Menu Button - Fixed position */}
      <MobileMenuButtonWrapper />

      {/* Content */}
      <div className="space-y-6 p-4 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Daftar Pertunjukan</h2>
            <p className="text-sm text-zinc-500">Total {allEvents.length} pertunjukan terdaftar</p>
          </div>
          <AddEventModal triggerType="add" />
        </div>

        {/* Grid Cards */}
        {allEvents.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white">
            <div className="text-center">
              <Ticket className="mx-auto h-16 w-16 text-zinc-300" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                Belum ada pertunjukan
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Klik tombol &quot;Tambah Pertunjukan&quot; untuk mulai menambahkan event dan kategori tiket.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Layout - Two Independent Scrollable Rows */}
            <div className="block space-y-4 md:hidden">
              {(() => {
                const half = Math.ceil(allEvents.length / 2);
                const topRow = allEvents.slice(0, half);
                const bottomRow = allEvents.slice(half);

                return (
                  <>
                    <div className="hide-scrollbar flex w-full gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                      {topRow.map((data) => (
                        <div key={data.event.id} className="w-[75%] flex-none snap-start sm:w-[45%]">
                          <EventCard {...data} className="h-full" />
                        </div>
                      ))}
                    </div>
                    {bottomRow.length > 0 && (
                      <div className="hide-scrollbar flex w-full gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                        {bottomRow.map((data) => (
                          <div key={data.event.id} className="w-[75%] flex-none snap-start sm:w-[45%]">
                            <EventCard {...data} className="h-full" />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Desktop Layout - Standard Grid */}
            <div className="hidden grid-cols-1 gap-6 sm:grid-cols-2 md:grid lg:grid-cols-3 xl:grid-cols-4">
              {allEvents.map((data) => (
                <EventCard key={data.event.id} {...data} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, eventTickets, lowestPrice, ticketCount, className = "" }: {
  event: typeof events.$inferSelect;
  eventTickets: typeof tickets.$inferSelect[];
  lowestPrice: number;
  ticketCount: number;
  className?: string;
}) {
  const d = event.showDate;
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Poster Image */}
      <div className="relative aspect-4/3 md:aspect-video w-full overflow-hidden bg-zinc-100">
        {event.posterUrl ? (
          <Image
            src={event.posterUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200">
            <Ticket className="h-12 w-12 text-zinc-400" />
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold text-zinc-900">
          {event.title}
        </h3>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>
              {d.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>
              {d.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              WIB
            </span>
          </div>
          
          {/* Ticket Price Summary */}
          {ticketCount > 0 && (
            <div className="mt-3 pt-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Tag className="h-4 w-4 text-green-600" />
              <span>
                Mulai Rp {lowestPrice.toLocaleString("id-ID")}
              </span>
            </div>
          )}
          
          {/* Action Buttons (Bottom) */}
          <div className="flex items-center gap-2 border-t border-zinc-100 pt-3 mt-4">
            <AddEventModal 
              triggerType="edit" 
              initialData={{
                id: event.id,
                title: event.title,
                description: event.description || "",
                posterUrl: event.posterUrl || "",
                showDate: event.showDate.toISOString(),
                tickets: eventTickets,
              }} 
            />
            <DeleteEventButton id={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
