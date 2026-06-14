"use server";

import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";

interface SubmitTestimonialInput {
  name: string;
  rating: number;
  message: string;
}

interface ActionResult {
  success: boolean;
  message: string;
  data?: { id: string };
}

/**
 * Submit a new testimonial from a user
 * Testimonials are created with 'pending' status and require admin approval
 */
export async function submitTestimonial(
  input: SubmitTestimonialInput,
): Promise<ActionResult> {
  try {
    // Validation
    if (!input.name || input.name.trim().length === 0) {
      return {
        success: false,
        message: "Nama tidak boleh kosong.",
      };
    }

    if (input.name.trim().length > 255) {
      return {
        success: false,
        message: "Nama terlalu panjang (maksimal 255 karakter).",
      };
    }

    if (!input.rating || input.rating < 1 || input.rating > 5) {
      return {
        success: false,
        message: "Rating harus antara 1-5 bintang.",
      };
    }

    if (!input.message || input.message.trim().length === 0) {
      return {
        success: false,
        message: "Pesan testimoni tidak boleh kosong.",
      };
    }

    if (input.message.trim().length > 1000) {
      return {
        success: false,
        message: "Pesan terlalu panjang (maksimal 1000 karakter).",
      };
    }

    // Generate unique ID using CUID2
    const testimonialId = createId();

    // Insert testimonial into database
    await db.insert(testimonials).values({
      id: testimonialId,
      name: input.name.trim(),
      rating: input.rating,
      message: input.message.trim(),
      status: "pending", // Default status for moderation
      createdAt: new Date(),
    });

    return {
      success: true,
      message:
        "Terima kasih! Testimoni Anda telah dikirim dan akan ditampilkan setelah disetujui admin.",
      data: { id: testimonialId },
    };
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return {
      success: false,
      message:
        "Terjadi kesalahan saat mengirim testimoni. Silakan coba lagi nanti.",
    };
  }
}

/**
 * Get all approved testimonials for public display
 */
export async function getApprovedTestimonials(): Promise<{
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    rating: number;
    message: string;
    createdAt: Date;
  }>;
}> {
  try {

    const approvedTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.status, "approved"))
      .orderBy(testimonials.createdAt);

    return {
      success: true,
      data: approvedTestimonials,
    };
  } catch (error) {
    console.error("Error fetching approved testimonials:", error);
    return {
      success: false,
      data: [],
    };
  }
}

/**
 * Update testimonial status (approve or reject)
 */
export async function updateTestimonialStatus(
  id: string,
  newStatus: "approved" | "rejected",
): Promise<ActionResult> {
  try {
    await db
      .update(testimonials)
      .set({ status: newStatus })
      .where(eq(testimonials.id, id));

    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return {
      success: true,
      message:
        newStatus === "approved"
          ? "Ulasan berhasil disetujui."
          : "Ulasan berhasil ditolak.",
    };
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    return {
      success: false,
      message: "Gagal memperbarui status ulasan. Silakan coba lagi.",
    };
  }
}
