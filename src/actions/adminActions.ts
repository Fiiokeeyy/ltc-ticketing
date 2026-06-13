"use server";

import { db } from "@/db";
import { transactions, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendETicketEmail } from "@/lib/mailer";

interface ActionResult {
  success: boolean;
  message: string;
}

/**
 * Verify payment for a transaction
 * Updates transaction status from 'pending_verification' to 'verified'
 * Sends e-ticket email to customer upon successful verification
 */
export async function verifyPayment(orderId: string): Promise<ActionResult> {
  try {
    if (!orderId || orderId.trim().length === 0) {
      return {
        success: false,
        message: "ID pesanan tidak valid.",
      };
    }

    // Fetch transaction WITH event title via LEFT JOIN
    const existingTransaction = await db
      .select({
        id: transactions.id,
        eventId: transactions.eventId,
        customerName: transactions.customerName,
        customerEmail: transactions.customerEmail,
        ticketCategory: transactions.ticketCategory,
        ticketQuantity: transactions.ticketQuantity,
        totalAmount: transactions.totalAmount,
        paymentMethod: transactions.paymentMethod,
        paymentProofUrl: transactions.paymentProofUrl,
        status: transactions.status,
        eventTitle: events.title,
      })
      .from(transactions)
      .leftJoin(events, eq(transactions.eventId, events.id))
      .where(eq(transactions.id, orderId))
      .limit(1);

    if (existingTransaction.length === 0) {
      return {
        success: false,
        message: "Transaksi tidak ditemukan.",
      };
    }

    const transaction = existingTransaction[0];

    // Check if already verified
    if (transaction.status === "verified") {
      return {
        success: false,
        message: "Transaksi sudah diverifikasi sebelumnya.",
      };
    }

    // Check if payment proof exists
    if (!transaction.paymentProofUrl) {
      return {
        success: false,
        message: "Bukti pembayaran belum diupload.",
      };
    }

    // Update transaction status to verified
    await db
      .update(transactions)
      .set({ status: "verified" })
      .where(eq(transactions.id, orderId));

    // Send E-Ticket Email
    // Wrap email sending in separate try-catch to ensure verification isn't rolled back
    try {
      await sendETicketEmail({
        orderId: transaction.id,
        customerName: transaction.customerName,
        customerEmail: transaction.customerEmail,
        // eventTitle sekarang didapat dari JOIN — tidak lagi undefined
        eventTitle: transaction.eventTitle ?? "LTC Indonesia",
        ticketCategory: transaction.ticketCategory,
        ticketQuantity: transaction.ticketQuantity,
        totalAmount: transaction.totalAmount,
        paymentMethod: transaction.paymentMethod as
          | "qris"
          | "mybca"
          | "blu"
          | "superbank",
      });

      console.log(
        `E-Ticket email sent successfully to ${transaction.customerEmail}`,
      );
    } catch (emailError) {
      // Log email error but don't fail the verification
      console.error("Failed to send e-ticket email:", emailError);
      // You could also store this error in a notification table for admin
    }

    // Revalidate admin transactions page to show updated data
    revalidatePath("/admin/transactions");
    // Also revalidate dashboard to update stats
    revalidatePath("/admin");

    return {
      success: true,
      message:
        "Pembayaran berhasil diverifikasi dan e-tiket telah dikirim ke email pelanggan.",
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memverifikasi pembayaran.",
    };
  }
}

/**
 * Reject payment for a transaction
 * Updates transaction status to 'rejected'
 */
export async function rejectPayment(orderId: string): Promise<ActionResult> {
  try {
    if (!orderId || orderId.trim().length === 0) {
      return {
        success: false,
        message: "ID pesanan tidak valid.",
      };
    }

    // Update transaction status to rejected
    await db
      .update(transactions)
      .set({ status: "rejected" })
      .where(eq(transactions.id, orderId));

    // Revalidate admin transactions page
    revalidatePath("/admin/transactions");
    // Also revalidate dashboard to update stats
    revalidatePath("/admin");

    return {
      success: true,
      message: "Pembayaran ditolak.",
    };
  } catch (error) {
    console.error("Error rejecting payment:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menolak pembayaran.",
    };
  }
}
