"use server";

import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function getAdminRole(): Promise<string | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  return payload?.role || null;
}
