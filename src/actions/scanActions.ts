"use server";

import { db } from "@/db";
import { transactions, events } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface ScanResult {
  success: boolean;
  message: string;
  data?: {
    customerName: string;
    eventTitle: string;
    ticketCategory: string;
    ticketQuantity: number;
    ticketIndex: string;
  };
}

export async function verifyTicket(qrData: string): Promise<ScanResult> {
  try {
    if (!qrData) {
      return { success: false, message: "QR Code tidak terbaca" };
    }

    // qrData is expected to be in format "transactionId-ticketIndex" (e.g. "clq3...-1")
    const lastDashIndex = qrData.lastIndexOf("-");
    if (lastDashIndex === -1) {
      return { success: false, message: "Format QR Code tidak valid" };
    }

    const transactionId = qrData.substring(0, lastDashIndex);
    const ticketIndex = qrData.substring(lastDashIndex + 1);

    // Fetch transaction and event details
    const [transaction] = await db
      .select({
        id: transactions.id,
        status: transactions.status,
        customerName: transactions.customerName,
        ticketCategory: transactions.ticketCategory,
        ticketQuantity: transactions.ticketQuantity,
        eventTitle: events.title,
      })
      .from(transactions)
      .leftJoin(events, eq(transactions.eventId, events.id))
      .where(eq(transactions.id, transactionId))
      .limit(1);

    if (!transaction) {
      return { success: false, message: "Tiket Tidak Valid (Data tidak ditemukan)" };
    }

    // Check payment status
    if (transaction.status !== "verified") {
      return { success: false, message: "Pembayaran Belum Lunas" };
    }

    // Valid ticket
    return {
      success: true,
      message: "Valid",
      data: {
        customerName: transaction.customerName,
        eventTitle: transaction.eventTitle || "Event Tidak Diketahui",
        ticketCategory: transaction.ticketCategory,
        ticketQuantity: transaction.ticketQuantity,
        ticketIndex: ticketIndex,
      },
    };
  } catch (error) {
    console.error("Scan Error:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat memverifikasi tiket" };
  }
}
