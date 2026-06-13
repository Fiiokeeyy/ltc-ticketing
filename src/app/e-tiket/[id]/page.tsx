import { notFound } from "next/navigation";
import { db } from "@/db";
import { transactions, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import ETicketCard from "@/components/ETicketCard"

interface ETicketPageProps {
  params: Promise<{ id: string }>;
}

export default async function ETicketPage({ params }: ETicketPageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // Fetch transaction with event details
  const result = await db
    .select({
      transaction: transactions,
      event: events,
    })
    .from(transactions)
    .leftJoin(events, eq(transactions.eventId, events.id))
    .where(eq(transactions.id, orderId))
    .limit(1);

  // If transaction not found
  if (result.length === 0) {
    notFound();
  }

  const { transaction, event } = result[0];

  // Only show e-ticket if payment is verified
  if (transaction.status !== "verified") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900">
            Pembayaran Belum Diverifikasi
          </h1>
          <p className="text-zinc-600">
            E-Tiket Anda belum tersedia. Silakan selesaikan pembayaran dan
            tunggu verifikasi dari admin.
          </p>
        </div>
      </div>
    );
  }

  // Fallback for event data if not found
  const displayEventTitle = event?.title || "Republik Mimpi";
  const displayEventDate = event?.showDate || new Date();

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-orange-50/30 to-zinc-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <ETicketCard
          orderId={transaction.id}
          customerName={transaction.customerName}
          customerEmail={transaction.customerEmail}
          eventTitle={displayEventTitle}
          eventDate={displayEventDate}
          ticketCategory={transaction.ticketCategory}
          ticketQuantity={transaction.ticketQuantity}
          totalAmount={transaction.totalAmount}
          createdAt={transaction.createdAt}
        />
      </div>
    </div>
  );
}
