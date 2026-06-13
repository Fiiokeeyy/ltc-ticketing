import { db } from "@/db";
import { transactions, events } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch all transactions with event data using LEFT JOIN
    const allTransactions = await db
      .select({
        id: transactions.id,
        eventId: transactions.eventId,
        customerName: transactions.customerName,
        customerEmail: transactions.customerEmail,
        customerWhatsapp: transactions.customerWhatsapp,
        ticketCategory: transactions.ticketCategory,
        ticketQuantity: transactions.ticketQuantity,
        totalAmount: transactions.totalAmount,
        paymentMethod: transactions.paymentMethod,
        paymentProofUrl: transactions.paymentProofUrl,
        status: transactions.status,
        createdAt: transactions.createdAt,
        eventTitle: events.title,
      })
      .from(transactions)
      .leftJoin(events, eq(transactions.eventId, events.id))
      .orderBy(desc(transactions.createdAt));

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
