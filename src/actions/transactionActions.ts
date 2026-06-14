"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import { transactions, events, tickets } from "@/db/schema";
import { sendStatusUpdateEmail } from "@/lib/mailer";
import { sendPaymentEmail } from "@/lib/mailer";

interface CreateTransactionData {
  eventId: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  ticketCategory: string;
  ticketQuantity: number;
  totalAmount: number;
  paymentMethod: string;
}

export async function createTransaction(data: CreateTransactionData) {
  try {
    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Check quota first
    const ticketInfo = await db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.eventId, data.eventId),
          eq(tickets.categoryName, data.ticketCategory)
        )
      )
      .limit(1);

    if (ticketInfo.length > 0) {
      if (ticketInfo[0].stockQuota < data.ticketQuantity) {
        return { success: false, error: "Kuota tiket tidak mencukupi" };
      }
      
      // Decrement quota
      await db.update(tickets)
        .set({ stockQuota: sql`${tickets.stockQuota} - ${data.ticketQuantity}` })
        .where(eq(tickets.id, ticketInfo[0].id));
    }

    // Insert transaction to database
    await db.insert(transactions).values({
      id: orderId,
      eventId: data.eventId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerWhatsapp: data.customerWhatsapp,
      ticketCategory: data.ticketCategory,
      ticketQuantity: data.ticketQuantity,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      paymentProofUrl: null,
      status: "pending_payment",
      createdAt: new Date(),
    });

    // Get event details for email
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, data.eventId))
      .limit(1);

    // Send payment email (non-blocking - don't fail checkout if email fails)
    try {
      if (event.length > 0) {
        await sendPaymentEmail({
          orderId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          eventTitle: event[0].title,
          ticketCategory: data.ticketCategory,
          ticketQuantity: data.ticketQuantity,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod as
            | "qris"
            | "mybca"
            | "blu"
            | "superbank",
        });
        console.log(`✅ Payment email sent to ${data.customerEmail}`);
      }
    } catch (emailError) {
      // Log email error but don't fail the transaction
      console.error("⚠️ Failed to send payment email:", emailError);
    }

    return {
      success: true,
      orderId,
    };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return {
      success: false,
      error: "Failed to create transaction",
    };
  }
}

export async function getTransactionById(orderId: string) {
  try {
    const result = await db
      .select({
        transaction: transactions,
        event: events,
      })
      .from(transactions)
      .leftJoin(events, eq(transactions.eventId, events.id))
      .where(eq(transactions.id, orderId))
      .limit(1);

    if (result.length === 0) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return {
      success: false,
      error: "Failed to fetch transaction",
    };
  }
}

export async function cancelTransaction(orderId: string) {
  try {
    // Only allow cancelling if status is pending_payment
    const tx = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, orderId),
          eq(transactions.status, "pending_payment")
        )
      )
      .limit(1);

    if (tx.length === 0) {
      return { success: false, error: "Transaction not found or already cancelled" };
    }

    const transaction = tx[0];

    await db
      .update(transactions)
      .set({ status: "cancelled" })
      .where(eq(transactions.id, orderId));

    // Restore quota
    await db
      .update(tickets)
      .set({ stockQuota: sql`${tickets.stockQuota} + ${transaction.ticketQuantity}` })
      .where(
        and(
          eq(tickets.eventId, transaction.eventId),
          eq(tickets.categoryName, transaction.ticketCategory)
        )
      );

    // Send cancellation email
    sendStatusUpdateEmail(
      {
        orderId: transaction.id,
        customerName: transaction.customerName,
        customerEmail: transaction.customerEmail,
        eventTitle: "Event LTC Indonesia",
        ticketCategory: transaction.ticketCategory,
        ticketQuantity: transaction.ticketQuantity,
        totalAmount: transaction.totalAmount,
        paymentMethod: (transaction.paymentMethod as "qris" | "mybca" | "blu" | "superbank") || "qris",
      },
      "cancelled"
    ).catch(console.error);

    revalidatePath(`/checkout/${transaction.eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error cancelling transaction:", error);
    return {
      success: false,
      error: "Failed to cancel transaction",
    };
  }
}
