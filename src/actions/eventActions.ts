"use server";

import { db } from "@/db";
import { events, tickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

interface TicketCategory {
  categoryName: string;
  price: number;
  stockQuota: number;
}

interface AddEventData {
  title: string;
  description: string;
  posterUrl: string;
  showDate: Date;
  tickets: TicketCategory[];
}

export async function addEvent(data: AddEventData) {
  try {
    if (!data.tickets || data.tickets.length === 0) {
      return { success: false, error: "Minimal harus ada 1 kategori tiket." };
    }

    await db.transaction(async (tx) => {
      const eventId = createId();

      // 1. Insert Event
      await tx.insert(events).values({
        id: eventId,
        title: data.title,
        description: data.description,
        posterUrl: data.posterUrl,
        showDate: data.showDate,
        createdAt: new Date(),
      });

      // 2. Insert Tickets
      const ticketValues = data.tickets.map((ticket) => ({
        id: createId(),
        eventId: eventId,
        categoryName: ticket.categoryName,
        price: ticket.price,
        stockQuota: ticket.stockQuota,
      }));

      await tx.insert(tickets).values(ticketValues);
    });

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Error adding event:", error);
    return { success: false, error: "Gagal menambahkan event dan tiket." };
  }
}

interface UpdateEventData {
  title: string;
  description: string;
  posterUrl: string;
  showDate: Date;
}

export async function updateEvent(id: string, data: UpdateEventData) {
  try {
    await db
      .update(events)
      .set({
        title: data.title,
        description: data.description,
        posterUrl: data.posterUrl,
        showDate: data.showDate,
      })
      .where(eq(events.id, id));

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Gagal memperbarui event." };
  }
}

export async function deleteEvent(id: string) {
  try {
    await db.delete(events).where(eq(events.id, id));

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    // If the error is due to foreign key constraint (onDelete: restrict)
    if (
      error instanceof Error &&
      (error.message.includes("FOREIGN KEY") ||
        error.message.includes("constraint"))
    ) {
      return {
        success: false,
        error:
          "Gagal menghapus event karena sudah ada transaksi/tiket yang terhubung.",
      };
    }
    return { success: false, error: "Terjadi kesalahan saat menghapus event." };
  }
}
