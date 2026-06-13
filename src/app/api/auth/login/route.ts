import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME, TOKEN_EXPIRY_HOURS } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body as {
      username?: string;
      password?: string;
    };

    // 1. Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi." },
        { status: 400 },
      );
    }

    // 2. Cari user di database berdasarkan email ATAU name
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, username), eq(users.name, username)))
      .limit(1);

    if (!user) {
      // Delay kecil untuk mencegah user enumeration via timing attack
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json(
        { success: false, message: "Akun tidak terdaftar." },
        { status: 401 },
      );
    }

    // 3. Pastikan akun ini memiliki password (Admin/Gate), bukan akun Customer
    if (!user.password) {
      return NextResponse.json(
        { success: false, message: "Akun ini tidak memiliki akses login." },
        { status: 403 },
      );
    }

    // 4. Verifikasi password menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json(
        { success: false, message: "Kata sandi salah." },
        { status: 401 },
      );
    }

    // 5. Normalisasi role ke huruf kecil untuk konsistensi di JWT & middleware
    const role = user.role.toLowerCase();

    // 6. Buat JWT token dengan email dan role
    const token = await signToken(user.email, role);

    // 7. Set HttpOnly cookie
    const response = NextResponse.json({ success: true, role });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: TOKEN_EXPIRY_HOURS * 3600,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
