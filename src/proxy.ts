/**
 * src/proxy.ts — Implementasi lengkap Next.js 16 Proxy
 *
 * Memproteksi route /admin/* dan /api/admin/* dari akses tanpa autentikasi.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

// Path yang diproteksi
const PROTECTED_PATHS = ["/admin", "/api/admin"];

// /admin/login dikecualikan walau berada di bawah /admin
const PUBLIC_PATHS = ["/admin/login", "/api/auth"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return redirectToLogin(request, pathname);
  }

  const payload = await verifyToken(sessionCookie.value);

  if (!payload) {
    return redirectToLogin(request, pathname);
  }

  // Role-based Access Control (RBAC)
  const role = payload.role;

  // Jika akun adalah GATE, hanya izinkan akses ke /admin/scanner dan fungsi logout
  if (role === "gate") {
    // Izinkan path spesifik untuk Gate
    const isAllowedForGate =
      pathname === "/admin/scanner" ||
      pathname === "/api/auth/logout" ||
      pathname === "/admin/login";

    if (!isAllowedForGate) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, message: "Akses ditolak. Fitur ini hanya untuk Admin." },
          { status: 403 },
        );
      }
      // Redirect paksa kembali ke scanner
      return NextResponse.redirect(new URL("/admin/scanner", request.url));
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, from: string) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", from);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
