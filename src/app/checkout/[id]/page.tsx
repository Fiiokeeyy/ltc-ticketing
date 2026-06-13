import { notFound } from "next/navigation";
import { db } from "@/db";
import { events, tickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ShoppingCart } from "lucide-react";
import CheckoutClient from "@/components/CheckoutClient";
import { getActivePaymentMethods } from "@/actions/paymentMethodActions";
import PageHero from "@/components/PageHero";

interface CheckoutPageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  // Extract params asynchronously (Next.js 15+ pattern)
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  // Fetch event data from database
  const eventData = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (eventData.length === 0) {
    notFound();
  }

  const event = eventData[0];

  // Fetch ticket categories for this event
  const eventTickets = await db
    .select()
    .from(tickets)
    .where(eq(tickets.eventId, eventId));

  if (eventTickets.length === 0) {
    notFound();
  }

  // Fetch active payment methods
  const pmResult = await getActivePaymentMethods();
  const paymentMethods = pmResult.success && pmResult.data ? pmResult.data : [];

  return (
    <div className="min-h-screen bg-zinc-50">
      <PageHero
        badge={<><ShoppingCart className="h-4 w-4" /> Checkout Aman & Mudah</>}
        title="Selesaikan Pesanan"
        description="Lengkapi data diri dan pilih metode pembayaran untuk melanjutkan pemesanan tiket Anda."
        maxWidth="4xl"
        size="large"
      />

      {/* --- CHECKOUT FORM --- */}
      <CheckoutClient event={event} ticketCategories={eventTickets} paymentMethods={paymentMethods} />
    </div>
  );
}
