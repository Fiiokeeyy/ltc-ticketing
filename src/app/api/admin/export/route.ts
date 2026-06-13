import { db } from "@/db";
import { transactions, events } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getTransactionDateFilter } from "@/lib/dateFilter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthStr = searchParams.get("month");
    const yearStr = searchParams.get("year");

    const conditions = getTransactionDateFilter(monthStr, yearStr);

    // Fetch filtered transactions with their associated event title
    const exportData = await db
      .select({
        id: transactions.id,
        waktu: transactions.createdAt,
        namaEvent: events.title,
        namaPembeli: transactions.customerName,
        email: transactions.customerEmail,
        whatsapp: transactions.customerWhatsapp,
        kategoriTiket: transactions.ticketCategory,
        jumlahTiket: transactions.ticketQuantity,
        totalBayar: transactions.totalAmount,
        metodeBayar: transactions.paymentMethod,
        status: transactions.status,
      })
      .from(transactions)
      .leftJoin(events, eq(transactions.eventId, events.id))
      .where(conditions)
      .orderBy(desc(transactions.createdAt));

    return NextResponse.json({ success: true, data: exportData });
  } catch (error) {
    console.error("Error fetching export data:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data untuk export" },
      { status: 500 }
    );
  }
}
