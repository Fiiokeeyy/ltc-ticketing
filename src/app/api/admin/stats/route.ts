import { db } from "@/db";
import { transactions, events } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { getTransactionDateFilter } from "@/lib/dateFilter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthStr = searchParams.get("month");
    const yearStr = searchParams.get("year");

    const conditions = getTransactionDateFilter(monthStr, yearStr);

    // Fetch filtered transactions
    const allTransactions = await db.select().from(transactions).where(conditions);

    // Calculate statistics
    const totalTickets = allTransactions.reduce(
      (sum, t) => sum + t.ticketQuantity,
      0,
    );

    const pendingVerification = allTransactions.filter(
      (t) => t.status === "pending_verification",
    ).length;

    const totalRevenue = allTransactions
      .filter((t) => t.status === "verified")
      .reduce((sum, t) => sum + t.totalAmount, 0);

    // Status breakdown for chart
    const statusData = {
      verified: allTransactions.filter((t) => t.status === "verified").length,
      pending_verification: allTransactions.filter(
        (t) => t.status === "pending_verification",
      ).length,
      pending_payment: allTransactions.filter(
        (t) => t.status === "pending_payment",
      ).length,
      rejected: allTransactions.filter((t) => t.status === "rejected").length,
      cancelled: allTransactions.filter((t) => t.status === "cancelled").length,
    };

    // Revenue by event for Bar Chart
    // Join transactions with events
    const allEvents = await db.select().from(events);
    const revenueMap = new Map<string, { eventName: string; revenue: number }>();
    
    // Initialize map with all events
    allEvents.forEach(e => {
      revenueMap.set(e.id, { eventName: e.title, revenue: 0 });
    });

    // Sum revenue for verified transactions
    allTransactions.forEach(t => {
      if (t.status === "verified" && revenueMap.has(t.eventId)) {
        const current = revenueMap.get(t.eventId)!;
        current.revenue += t.totalAmount;
      }
    });

    // Convert map to array and sort by revenue (descending)
    const revenueByEvent = Array.from(revenueMap.values())
      .filter(item => item.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      totalTickets,
      pendingVerification,
      totalRevenue,
      statusData,
      revenueByEvent,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
