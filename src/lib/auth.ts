/**
 * Auth helper — JWT sign & verify menggunakan Web Crypto API (built-in)
 * Tidak memerlukan library eksternal (jose, jsonwebtoken, dll.)
 * Kompatibel dengan Node.js runtime yang digunakan Next.js Proxy.
 */

const COOKIE_NAME = "ltc_admin_session";
const TOKEN_EXPIRY_HOURS = 8; // Token berlaku 8 jam

// Encode string ke Uint8Array untuk Web Crypto
function str2ab(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer as ArrayBuffer;
}

// Decode ArrayBuffer ke string
function ab2str(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

// Base64url encode (tidak pakai padding, URL-safe)
function base64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// Base64url decode ke ArrayBuffer
function fromBase64url(str: string): ArrayBuffer {
  const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

// Import HMAC key dari secret string
async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    str2ab(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

interface JWTPayload {
  sub: string; // email
  role: string; // 'admin' | 'gate'
  iat: number; // issued at
  exp: number; // expiry
}

/**
 * Buat JWT token yang ditandatangani dengan HMAC-SHA256
 */
export async function signToken(email: string, role: string): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET tidak dikonfigurasi.");

  const header = base64url(str2ab(JSON.stringify({ alg: "HS256", typ: "JWT" })));

  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: email,
    role,
    iat: now,
    exp: now + TOKEN_EXPIRY_HOURS * 3600,
  };
  const encodedPayload = base64url(str2ab(JSON.stringify(payload)));

  const signingInput = `${header}.${encodedPayload}`;
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, str2ab(signingInput));

  return `${signingInput}.${base64url(signature)}`;
}

/**
 * Verifikasi JWT token — kembalikan payload jika valid, null jika tidak
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, encodedPayload, sig] = parts;
    const signingInput = `${header}.${encodedPayload}`;

    const key = await importKey(secret);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64url(sig),
      str2ab(signingInput),
    );

    if (!isValid) return null;

    // Decode payload
    const payloadJson = ab2str(fromBase64url(encodedPayload));
    const payload: JWTPayload = JSON.parse(payloadJson);

    // Cek expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, TOKEN_EXPIRY_HOURS };
