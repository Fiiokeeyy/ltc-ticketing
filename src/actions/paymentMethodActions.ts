"use server";

import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPaymentMethods() {
  try {
    const data = await db
      .select()
      .from(paymentMethods)
      .orderBy(desc(paymentMethods.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return { success: false, error: "Failed to fetch payment methods" };
  }
}

export async function getActivePaymentMethods() {
  try {
    const data = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.isActive, true))
      .orderBy(desc(paymentMethods.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching active payment methods:", error);
    return { success: false, error: "Failed to fetch active payment methods" };
  }
}

export async function createPaymentMethod(data: {
  id: string;
  name: string;
  type: string;
  instruction: string;
  accountNumber?: string | null;
  accountName?: string | null;
  qrImageUrl?: string | null;
  isActive?: boolean;
}) {
  try {
    await db.insert(paymentMethods).values({
      ...data,
      createdAt: new Date(),
    });
    
    revalidatePath("/admin/payment-methods");
    revalidatePath("/checkout/[id]", "page");
    revalidatePath("/payment/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error creating payment method:", error);
    return { success: false, error: "Failed to create payment method" };
  }
}

export async function updatePaymentMethod(
  id: string,
  data: Partial<{
    name: string;
    type: string;
    instruction: string;
    accountNumber: string | null;
    accountName: string | null;
    qrImageUrl: string | null;
    isActive: boolean;
  }>
) {
  try {
    await db
      .update(paymentMethods)
      .set(data)
      .where(eq(paymentMethods.id, id));
      
    revalidatePath("/admin/payment-methods");
    revalidatePath("/checkout/[id]", "page");
    revalidatePath("/payment/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating payment method:", error);
    return { success: false, error: "Failed to update payment method" };
  }
}

export async function togglePaymentMethodStatus(id: string, currentStatus: boolean) {
  try {
    await db
      .update(paymentMethods)
      .set({ isActive: !currentStatus })
      .where(eq(paymentMethods.id, id));
      
    revalidatePath("/admin/payment-methods");
    revalidatePath("/checkout/[id]", "page");
    revalidatePath("/payment/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error toggling payment method status:", error);
    return { success: false, error: "Failed to toggle payment method status" };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
    
    revalidatePath("/admin/payment-methods");
    revalidatePath("/checkout/[id]", "page");
    revalidatePath("/payment/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return { success: false, error: "Failed to delete payment method" };
  }
}
