import { db } from "@/db";
import { events, tickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Sparkles } from "lucide-react";
import EventsGrid from "@/components/EventsGrid";
import PageHero from "@/components/PageHero";
import ScrollAnimation from "@/components/ScrollAnimation";

export default async function TiketPage() {
  // Fetch all events with their tickets
  const allEvents = await db.select().from(events);

  // Fetch tickets for each event
  const eventsWithTickets = await Promise.all(
    allEvents.map(async (event) => {
      const eventTickets = await db
        .select()
        .from(tickets)
        .where(eq(tickets.eventId, event.id));
      return {
        ...event,
        tickets: eventTickets,
      };
    }),
  );

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        badge={<><Sparkles className="h-4 w-4" /> Pertunjukan Teater Terbaik</>}
        title="Jadwal Pertunjukan"
        description="Jelajahi koleksi pertunjukan teater terbaik kami. Dari drama klasik hingga karya kontemporer, temukan pengalaman seni yang tak terlupakan."
        maxWidth="4xl"
        size="large"
      />

      {/* Events Grid */}
      <div className="container mx-auto px-6 pb-20">
        <ScrollAnimation delay={100} direction="up">
          <EventsGrid events={eventsWithTickets} />
        </ScrollAnimation>
      </div>
    </div>
  );
}
