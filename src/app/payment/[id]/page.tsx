import { eq } from "drizzle-orm";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { notFound } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Ticket,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  Landmark,
} from "lucide-react";
import { getTransactionById } from "@/actions/transactionActions";
import PaymentTimer from "@/components/PaymentTimer";
import CopyButton from "@/components/CopyButton";
import PaymentProofUpload from "@/components/PaymentProofUpload";
import Image from "next/image";

interface PaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  // Extract params asynchronously (Next.js 15+ pattern)
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // Fetch transaction data from database
  const result = await getTransactionById(orderId);

  if (!result.success || !result.data) {
    notFound();
  }

  const { transaction, event } = result.data;

  // Check if payment is expired (24 hours)
  const createdAt = new Date(transaction.createdAt);
  const expiryTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();
  const isExpired = now > expiryTime;

  // Format date
  const createdAtStr = createdAt.toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Fetch Payment Method dynamically
  const paymentMethodResult = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.id, transaction.paymentMethod))
    .limit(1);

  const selectedPayment = paymentMethodResult[0] || {
    name: "Metode Pembayaran",
    type: "bank_transfer",
    instruction: "Instruksi tidak ditemukan.",
    accountNumber: null,
    accountName: null,
    qrImageUrl: null,
  };

  const PaymentIcon = selectedPayment.type === 'qris' ? QrCode : selectedPayment.type === 'bank_transfer' ? Landmark : CreditCard;

  return (
    <div className="min-h-screen bg-zinc-50 py-8 md:py-12">
      {/* Container diperlebar sedikit agar rasio 60/40 terlihat lebih lega */}
      <div className="mx-auto max-w-5xl px-4">
        
        {/* Status Banner */}
        {isExpired ? (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">
                Pembayaran Kadaluarsa
              </h3>
              <p className="text-sm text-red-700">
                Pesanan ini telah melewati batas waktu pembayaran 24 jam.
                Silakan buat pesanan baru.
              </p>
            </div>
          </div>
        ) : transaction.status === "pending_verification" ? (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <Clock className="h-6 w-6 shrink-0 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">
                Menunggu Verifikasi
              </h3>
              <p className="text-sm text-blue-700">
                Bukti pembayaran Anda sedang diverifikasi oleh tim kami.
              </p>
            </div>
          </div>
        ) : transaction.status === "verified" ? (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">
                Pembayaran Terverifikasi
              </h3>
              <p className="text-sm text-green-700">
                Terima kasih! Pembayaran Anda telah dikonfirmasi. E-tiket telah
                dikirim ke email Anda.
              </p>
            </div>
          </div>
        ) : null}

        {/* Timer Banner */}
        {!isExpired && transaction.status === "pending_payment" && (
          <div className="mb-8 flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Selesaikan pembayaran dalam:
                </p>
                <p className="text-xs text-orange-700">
                  Pembayaran akan kadaluarsa setelah waktu habis
                </p>
              </div>
            </div>
            <PaymentTimer expiryTime={expiryTime.toISOString()} />
          </div>
        )}

        {/* Main Content - Grid 60/40 Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          
          {/* Left Column (60%) - Payment Instructions */}
          <div className="space-y-6 lg:col-span-3">
            {/* Payment Method Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              {/* Header */}
              <div className="mb-6 flex items-center gap-3 border-b border-zinc-200 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <PaymentIcon className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    Pembayaran via {selectedPayment.name}
                  </h2>
                  <p className="text-sm text-zinc-600">
                    {selectedPayment.instruction}
                  </p>
                </div>
              </div>

              {/* QRIS QR Code */}
              {selectedPayment.type === "qris" &&
                selectedPayment.qrImageUrl && (
                  <div className="flex flex-col items-center py-6">
                    <div className="inline-block rounded-2xl bg-white p-4 shadow-sm border border-zinc-100">
                      <div className="relative aspect-square w-64">
                        <Image
                          src={selectedPayment.qrImageUrl}
                          alt="QRIS Code"
                          fill
                          className="rounded-lg object-contain"
                        />
                      </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-zinc-600">
                      Scan QR Code ini dengan aplikasi pembayaran Anda
                    </p>
                  </div>
                )}

              {/* Bank Transfer / E-Wallet Details */}
              {(selectedPayment.type === "bank_transfer" || selectedPayment.type === "e_wallet") && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  {/* Account Number */}
                  {selectedPayment.accountNumber && (
                    <div className="pb-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        {selectedPayment.type === "bank_transfer" ? "Nomor Rekening" : "Nomor Akun / HP"}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-mono text-xl font-bold tracking-wider text-zinc-900">
                          {selectedPayment.accountNumber}
                        </p>
                        <CopyButton
                          text={selectedPayment.accountNumber || ""}
                        />
                      </div>
                    </div>
                  )}

                  {/* Separator */}
                  {selectedPayment.accountNumber &&
                    selectedPayment.accountName && (
                      <div className="border-b border-dashed border-zinc-300" />
                    )}

                  {/* Account Name */}
                  {selectedPayment.accountName && (
                    <div className="py-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Nama Penerima
                      </p>
                      <p className="text-lg font-semibold text-zinc-900">
                        {selectedPayment.accountName}
                      </p>
                    </div>
                  )}

                  {/* Separator */}
                  {selectedPayment.accountName && (
                    <div className="border-b border-dashed border-zinc-300" />
                  )}

                  {/* Transfer Amount */}
                  <div className="pt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Jumlah Transfer
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl font-bold text-orange-500">
                        Rp {transaction.totalAmount.toLocaleString("id-ID")}
                      </p>
                      <CopyButton text={transaction.totalAmount.toString()} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Proof */}
            {!isExpired && transaction.status === "pending_payment" && (
              <PaymentProofUpload orderId={transaction.id} />
            )}
          </div>

          {/* Right Column (40%) - Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Order Details Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
                <h3 className="mb-6 text-xl font-bold text-zinc-900">
                  Detail Pesanan
                </h3>

                {/* Order ID */}
                <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 overflow-hidden">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    ID Pesanan
                  </p>
                  <p className="break-all font-mono text-sm font-semibold text-zinc-900 sm:text-base">
                    {transaction.id}
                  </p>
                </div>

                <div className="space-y-6 border-t border-zinc-200 pt-6">
                  {/* Event Info */}
                  {event && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                        <Ticket className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Event
                        </p>
                        <p className="truncate text-sm font-semibold leading-tight text-zinc-900">
                          {event.title}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Category & Quantity */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                      <Ticket className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Tiket
                      </p>
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {transaction.ticketCategory} x {transaction.ticketQuantity}
                      </p>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                      <User className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Nama
                      </p>
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {transaction.customerName}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                      <Mail className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Email
                      </p>
                      <p className="break-all text-sm font-semibold text-zinc-900">
                        {transaction.customerEmail}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                      <Phone className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        WhatsApp
                      </p>
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {transaction.customerWhatsapp}
                      </p>
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                      <Calendar className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Waktu Pemesanan
                      </p>
                      <p className="text-sm font-semibold leading-tight text-zinc-900">
                        {createdAtStr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="mt-8 rounded-xl bg-orange-50 p-4 border border-orange-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-bold text-zinc-700">
                      Total Pembayaran
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-orange-600">
                      Rp {transaction.totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}