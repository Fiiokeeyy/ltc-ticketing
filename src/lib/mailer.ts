import nodemailer from "nodemailer";

// Validate email configuration
function validateEmailConfig() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email configuration is missing. Please check EMAIL_USER and EMAIL_PASS in your environment variables.",
    );
  }
}

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface PaymentEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  eventTitle: string;
  ticketCategory: string;
  ticketQuantity: number;
  totalAmount: number;
  paymentMethod: "qris" | "mybca" | "blu" | "superbank";
}

/**
 * Send payment email to customer after checkout
 */
export async function sendPaymentEmail(orderData: PaymentEmailData) {
  try {
    // Validate configuration
    validateEmailConfig();

    const {
      orderId,
      customerName,
      customerEmail,
      eventTitle,
      ticketCategory,
      ticketQuantity,
      totalAmount,
      paymentMethod,
    } = orderData;

    // Payment instructions based on method
    let paymentInstructions = "";
    if (paymentMethod === "mybca") {
      paymentInstructions = `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 16px;">Transfer ke myBCA</h3>
          <p style="margin: 0; color: #78350f; font-size: 14px;">
            <strong>Nomor Rekening:</strong> 1234567890<br>
            <strong>Atas Nama:</strong> LTC Indonesia
          </p>
        </div>
      `;
    } else if (paymentMethod === "blu") {
      paymentInstructions = `
        <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 16px;">Transfer ke blu by BCA Digital</h3>
          <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
            <strong>Nomor Rekening:</strong> 0987654321<br>
            <strong>Atas Nama:</strong> LTC Indonesia
          </p>
        </div>
      `;
    } else if (paymentMethod === "superbank") {
      paymentInstructions = `
        <div style="background-color: #f3e8ff; border-left: 4px solid #a855f7; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #6b21a8; font-size: 16px;">Transfer ke Superbank</h3>
          <p style="margin: 0; color: #581c87; font-size: 14px;">
            <strong>Nomor Rekening:</strong> 1122334455<br>
            <strong>Atas Nama:</strong> LTC Indonesia
          </p>
        </div>
      `;
    } else if (paymentMethod === "qris") {
      paymentInstructions = `
        <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #166534; font-size: 16px;">Pembayaran via QRIS</h3>
          <p style="margin: 0; color: #14532d; font-size: 14px;">
            Silakan klik tombol di bawah ini untuk melihat dan melakukan scan Barcode QRIS.
          </p>
        </div>
      `;
    }

    // Get application URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const paymentUrl = `${appUrl}/payment/${orderId}`;

    // Calculate payment deadline (24 hours from now)
    const now = new Date();
    const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const deadlineStr = deadline.toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });

    // HTML Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Menunggu Pembayaran - LTC Indonesia</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header with Timer Box (No Logo) -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px; font-weight: bold;">Menunggu Pembayaran</h1>
                    
                    <!-- Timer Box (Similar to Web) -->
                    <div style="display: inline-block; background-color: #18181b; border-radius: 12px; padding: 16px 24px; margin: 20px 0;">
                      <p style="color: #a1a1aa; margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Selesaikan pembayaran sebelum:</p>
                      <p style="color: #ea580c; margin: 0; font-size: 18px; font-weight: bold;">${deadlineStr} WIB</p>
                    </div>
                    
                    <p style="color: #fed7aa; margin: 16px 0 0 0; font-size: 14px;">Terima kasih telah memesan tiket!</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <!-- Greeting -->
                    <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 20px;">Halo, ${customerName}!</h2>
                    <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.6; font-size: 15px;">
                      Pesanan Anda telah berhasil dibuat. Silakan selesaikan pembayaran dalam <strong>24 jam</strong> untuk mengonfirmasi pemesanan tiket Anda.
                    </p>

                    <!-- Order Summary Box -->
                    <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                      <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
                        📋 Detail Pesanan
                      </h3>
                      
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">ID Pesanan</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${orderId}</td>
                        </tr>
                        <tr>
                          <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Event</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${eventTitle}</td>
                        </tr>
                        <tr>
                          <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Kategori Tiket</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${ticketCategory}</td>
                        </tr>
                        <tr>
                          <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Jumlah</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${ticketQuantity} tiket</td>
                        </tr>
                        <tr style="border-top: 2px solid #e5e7eb;">
                          <td style="color: #111827; font-size: 16px; font-weight: bold; padding: 16px 0 0 0;">Total Pembayaran</td>
                          <td style="color: #ea580c; font-size: 20px; font-weight: bold; text-align: right; padding: 16px 0 0 0;">Rp ${totalAmount.toLocaleString("id-ID")}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Payment Instructions -->
                    <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">💳 Instruksi Pembayaran</h3>
                    ${paymentInstructions}

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${paymentUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.3);">
                        Klik di sini untuk Bayar & Upload Bukti
                      </a>
                    </div>

                    <!-- Additional Info -->
                    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 8px;">
                      <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                        <strong>ℹ️ Catatan Penting:</strong><br>
                        • Selesaikan pembayaran dalam 24 jam<br>
                        • Upload bukti pembayaran setelah transfer<br>
                        • E-tiket akan dikirim setelah pembayaran diverifikasi<br>
                        • Simpan ID pesanan Anda untuk referensi
                      </p>
                    </div>

                    <!-- Footer Note -->
                    <p style="color: #9ca3af; margin: 24px 0 0 0; font-size: 13px; line-height: 1.6;">
                      Jika Anda memiliki pertanyaan, silakan hubungi kami melalui email atau WhatsApp yang tertera di website kami.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 13px;">
                      © 2026 LTC Indonesia. All rights reserved.
                    </p>
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                      Email ini dikirim otomatis. Mohon tidak membalas email ini.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: {
        name: "LTC Indonesia",
        address: process.env.EMAIL_USER!,
      },
      to: customerEmail,
      subject: `Menunggu Pembayaran - Tiket LTC Indonesia [${orderId}]`,
      html: htmlContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending payment email:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to send payment email",
    };
  }
}

/**
 * Send e-ticket email to customer after payment verification
 */
export async function sendETicketEmail(orderData: PaymentEmailData) {
  try {
    validateEmailConfig();

    const {
      orderId,
      customerName,
      customerEmail,
      eventTitle,
      ticketCategory,
      ticketQuantity,
      totalAmount,
    } = orderData;

    // Fallback untuk event title jika undefined atau kosong
    const displayEventTitle = eventTitle || "Republik Mimpi";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const eTicketUrl = `${appUrl}/e-tiket/${orderId}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pembayaran Diverifikasi - E-Tiket Anda</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <tr>
                  <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                    <h1 style="color: #ffffff; margin: 0 0 12px 0; font-size: 28px; font-weight: bold;">Pembayaran Diverifikasi!</h1>
                    <p style="color: #dcfce7; margin: 0; font-size: 16px;">E-Tiket Anda sudah siap</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 20px;">Halo, ${customerName}! 🎉</h2>
                    <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.6; font-size: 15px;">
                      Selamat! Pembayaran Anda telah <strong>berhasil diverifikasi</strong>. Berikut adalah E-Tiket digital Anda untuk event <strong>${displayEventTitle}</strong>.
                    </p>

                    <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fed7aa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                      <h3 style="color: #9a3412; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; text-align: center;">
                        🎫 Informasi Tiket Anda
                      </h3>
                      
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #78350f; font-size: 14px; padding: 8px 0;">ID Pesanan</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${orderId}</td>
                        </tr>
                        <tr>
                          <td style="color: #78350f; font-size: 14px; padding: 8px 0;">Event</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${displayEventTitle}</td>
                        </tr>
                        <tr>
                          <td style="color: #78350f; font-size: 14px; padding: 8px 0;">Kategori</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${ticketCategory}</td>
                        </tr>
                        <tr>
                          <td style="color: #78350f; font-size: 14px; padding: 8px 0;">Jumlah Tiket</td>
                          <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${ticketQuantity}x tiket</td>
                        </tr>
                        <tr>
                          <td style="color: #78350f; font-size: 14px; padding: 8px 0;">Total Dibayar</td>
                          <td style="color: #ea580c; font-size: 16px; font-weight: bold; text-align: right; padding: 8px 0;">Rp ${totalAmount.toLocaleString("id-ID")}</td>
                        </tr>
                      </table>
                    </div>

                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${eTicketUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.3); margin: 8px;">
                        📱 Lihat E-Tiket Online
                      </a>
                    </div>

                    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 8px;">
                      <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                        <strong>📌 Petunjuk Penting:</strong><br>
                        • Simpan email ini sebagai bukti pembelian<br>
                        • Tunjukkan E-Tiket (online atau print) saat masuk venue<br>
                        • QR Code pada tiket akan di-scan oleh petugas<br>
                        • Tiket hanya berlaku untuk 1x scan<br>
                        • Datang 30 menit sebelum acara dimulai
                      </p>
                    </div>

                    <div style="text-align: center; margin: 24px 0; padding: 24px; background-color: #f9fafb; border-radius: 12px; border: 2px dashed #d1d5db;">
                      <p style="color: #374151; font-size: 15px; font-weight: 600; margin: 0 0 4px 0;">🎫 QR Code Tiket Anda</p>
                      <p style="color: #6b7280; font-size: 13px; margin: 0 0 20px 0;">Tunjukkan QR Code ini kepada petugas saat masuk venue</p>
                      ${Array.from(
                        { length: ticketQuantity },
                        (_, index) => `
                      <div style="display: inline-block; margin: 8px; text-align: center; vertical-align: top;">
                        <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.06);">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(orderId + "-" + (index + 1))}"
                            alt="QR Code Tiket ${index + 1}"
                            width="180"
                            height="180"
                            style="display: block; border-radius: 6px;"
                          />
                        </div>
                        <p style="color: #374151; font-size: 13px; font-weight: 600; margin: 8px 0 0 0;">Tiket ${index + 1}</p>
                        <p style="color: #9ca3af; font-size: 11px; margin: 2px 0 0 0;">${orderId}-${index + 1}</p>
                      </div>
                      `,
                      ).join("")}
                    </div>

                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
                      <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                        <strong>💬 Butuh Bantuan?</strong><br>
                        Jika ada pertanyaan, hubungi kami melalui WhatsApp atau email yang tertera di website LTC Indonesia.
                      </p>
                    </div>

                    <p style="color: #9ca3af; margin: 24px 0 0 0; font-size: 13px; line-height: 1.6; text-align: center;">
                      Terima kasih telah mempercayai LTC Indonesia.<br>
                      Sampai jumpa di acara! 🎭
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 13px;">
                      © 2026 LTC Indonesia. All rights reserved.
                    </p>
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                      Email ini dikirim otomatis. Mohon tidak membalas email ini.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: {
        name: "LTC Indonesia",
        address: process.env.EMAIL_USER!,
      },
      to: customerEmail,
      subject: `✅ Pembayaran Diverifikasi - E-Tiket ${displayEventTitle} [${orderId}]`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending e-ticket email:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to send e-ticket email",
    };
  }
}

export async function sendStatusUpdateEmail(
  orderData: PaymentEmailData,
  status: "cancelled" | "rejected"
) {
  try {
    validateEmailConfig();

    const {
      orderId,
      customerName,
      customerEmail,
      eventTitle,
    } = orderData;

    const displayEventTitle = eventTitle || "Event LTC Indonesia";
    
    let subject = "";
    let emoji = "";
    let title = "";
    let message = "";
    let bgColor = "";
    let iconColor = "";

    if (status === "cancelled") {
      subject = `❌ Pesanan Dibatalkan - Tiket ${displayEventTitle} [${orderId}]`;
      emoji = "❌";
      title = "Pesanan Dibatalkan";
      bgColor = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
      iconColor = "#fee2e2";
      message = `Pesanan tiket Anda untuk event <strong>${displayEventTitle}</strong> telah dibatalkan. Ini bisa terjadi karena batas waktu pembayaran telah habis atau pesanan dibatalkan secara manual. Jika Anda masih ingin menonton acara ini, silakan buat pesanan baru.`;
    } else {
      subject = `⚠️ Pembayaran Ditolak - Tiket ${displayEventTitle} [${orderId}]`;
      emoji = "⚠️";
      title = "Pembayaran Ditolak";
      bgColor = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      iconColor = "#fef3c7";
      message = `Pembayaran Anda untuk event <strong>${displayEventTitle}</strong> tidak dapat kami verifikasi dan terpaksa kami tolak. Ini bisa terjadi karena bukti transfer yang buram, nominal yang tidak sesuai, atau uang belum masuk ke rekening kami. Pesanan Anda kini telah dibatalkan dan kuota telah dikembalikan. Jika Anda telah mentransfer dana, silakan hubungi Customer Service kami melalui WhatsApp dengan menyertakan ID Pesanan Anda untuk proses refund manual.`;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <tr>
                  <td style="background: ${bgColor}; padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">${emoji}</div>
                    <h1 style="color: #ffffff; margin: 0 0 12px 0; font-size: 28px; font-weight: bold;">${title}</h1>
                    <p style="color: ${iconColor}; margin: 0; font-size: 16px;">ID Pesanan: ${orderId}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 20px;">Halo, ${customerName}.</h2>
                    <p style="color: #6b7280; margin: 0 0 24px 0; line-height: 1.6; font-size: 15px;">
                      ${message}
                    </p>

                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
                      <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                        <strong>💬 Butuh Bantuan?</strong><br>
                        Jika ada pertanyaan atau kendala, silakan hubungi kami melalui WhatsApp atau email yang tertera di website LTC Indonesia.
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 13px;">
                      © 2026 LTC Indonesia. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: {
        name: "LTC Indonesia",
        address: process.env.EMAIL_USER!,
      },
      to: customerEmail,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending status email:", error);
    return { success: false, error: "Failed to send status email" };
  }
}
