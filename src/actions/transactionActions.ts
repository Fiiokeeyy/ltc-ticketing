"use server";

import { db } from "@/db";
import { transactions, events } from "@/db/schema";
import { eq } from "drizzle-orm";
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
