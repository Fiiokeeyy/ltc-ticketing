"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { verifyPayment, rejectPayment } from "@/actions/adminActions";
import Image from "next/image";
import ConfirmModal from "@/components/modal/ConfirmModal";
import SuccessModal from "@/components/modal/SuccessModal";

interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  eventTitle: string | null;
  ticketCategory: string;
  ticketQuantity: number;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  paymentProofUrl: string | null;
  createdAt: Date;
}

interface TransactionRowProps {
  transaction: Transaction;
  onVerifySuccess?: () => void;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending_payment: {
    label: "Menunggu Pembayaran",
    className: "bg-zinc-100 text-zinc-700 border-zinc-300",
  },
  pending_verification: {
    label: "Menunggu Verifikasi",
    className: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  verified: {
    label: "Terverifikasi",
    className: "bg-green-100 text-green-700 border-green-300",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700 border-red-300",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-100 text-red-700 border-red-300",
  },
};

export default function TransactionRow({
  transaction,
  onVerifySuccess,
}: TransactionRowProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const statusInfo =
    STATUS_BADGE[transaction.status] || STATUS_BADGE.pending_payment;

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyPayment(transaction.id);
      if (result.success) {
        // Tutup modal konfirmasi
        setShowConfirmModal(false);

        // Tampilkan success modal
        setSuccessMessage("Pembayaran telah diverifikasi dan e-tiket PDF telah dikirim ke email pelanggan.");
        setShowSuccess(true);

        // Setelah 2 detik, tutup modal dan refresh
        setTimeout(() => {
          setShowSuccess(false);

          // Call parent refresh function
          if (onVerifySuccess) {
            onVerifySuccess();
          }

          // Also trigger router refresh
          router.refresh();
        }, 2000);
      } else {
        alert(`Error: ${result.message}`);
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Terjadi kesalahan saat memverifikasi pembayaran");
      setShowConfirmModal(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const result = await rejectPayment(transaction.id);
      if (result.success) {
        setShowRejectModal(false);
        setSuccessMessage("Pembayaran berhasil ditolak. Kuota tiket telah dikembalikan.");
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          if (onVerifySuccess) {
            onVerifySuccess();
          }
          router.refresh();
        }, 2000);
      } else {
        alert(`Error: ${result.message}`);
        setShowRejectModal(false);
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Terjadi kesalahan saat menolak pembayaran");
      setShowRejectModal(false);
    } finally {
      setIsRejecting(false);
    }
  };

  // Fallback event title if null
  const displayEventTitle =
    transaction.eventTitle || "Event (Data tidak tersedia)";

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Main Row */}
      <div className="grid grid-cols-12 items-center gap-3 p-4 md:gap-4">
        {/* ID Pesanan - Hidden on mobile */}
        <div className="col-span-12 md:col-span-2">
          <p className="text-xs font-medium text-zinc-500 md:hidden">
            ID Pesanan
          </p>
          <p className="truncate font-mono text-sm font-semibold text-zinc-900">
            {transaction.id.slice(0, 8)}...
          </p>
        </div>

        {/* Nama Pembeli */}
        <div className="col-span-6 md:col-span-2">
          <p className="text-xs font-medium text-zinc-500 md:hidden">Pembeli</p>
          <p className="truncate text-sm font-semibold text-zinc-900">
            {transaction.customerName}
          </p>
        </div>

        {/* Kategori & Jumlah */}
        <div className="col-span-6 md:col-span-3">
          <p className="text-xs font-medium text-zinc-500 md:hidden">Tiket</p>
          <p className="truncate text-sm text-zinc-700">
            {transaction.ticketCategory}
          </p>
          <p className="text-xs text-zinc-500">
            {transaction.ticketQuantity}x tiket
          </p>
        </div>

        {/* Total */}
        <div className="col-span-6 md:col-span-2">
          <p className="text-xs font-medium text-zinc-500 md:hidden">Total</p>
          <p className="text-sm font-bold text-orange-500">
            Rp {transaction.totalAmount.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Status */}
        <div className="col-span-6 md:col-span-2">
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Toggle Button */}
        <div className="col-span-12 md:col-span-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center rounded-lg border border-zinc-200 p-2 transition-colors hover:bg-zinc-50 md:w-auto cursor-pointer"
            aria-label={isExpanded ? "Tutup detail" : "Buka detail"}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-zinc-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-600" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="animate-slideDown border-t border-zinc-200 bg-zinc-50 p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column: Transaction Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-zinc-900">
                Detail Transaksi
              </h4>
              <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-sm text-zinc-600">ID Lengkap:</span>
                  <span className="break-all font-mono text-sm font-semibold text-zinc-900">
                    {transaction.id}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-sm text-zinc-600">Nama Pembeli:</span>
                  <span className="text-sm font-medium text-zinc-900">
                    {transaction.customerName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-sm text-zinc-600">Email:</span>
                  <span className="break-all text-sm text-zinc-900">
                    {transaction.customerEmail}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-sm text-zinc-600">Event:</span>
                  <span className="text-right text-sm font-medium text-zinc-900">
                    {displayEventTitle}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-sm text-zinc-600">Kategori Tiket:</span>
                  <span className="text-sm font-medium text-zinc-900">
                    {transaction.ticketCategory}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-sm text-zinc-600">
                    Tanggal Pembelian:
                  </span>
                  <span className="text-sm text-zinc-900">
                    {new Date(transaction.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-sm text-zinc-600">
                    Metode Pembayaran:
                  </span>
                  <span className="font-semibold uppercase text-zinc-900">
                    {transaction.paymentMethod || "N/A"}
                  </span>
                </div>
              </div>
              
              {/* Tolak Button on the Left Side */}
              {transaction.status === "pending_verification" && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isVerifying || isRejecting}
                    className="w-full cursor-pointer rounded-lg border border-red-500 bg-white px-6 py-3 font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ✕ Tolak Pembayaran
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Payment Proof & Actions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-zinc-900">
                Bukti Pembayaran
              </h4>
              {transaction.paymentProofUrl ? (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                    <div className="relative h-[300px] w-full">
                      <Image
                        src={transaction.paymentProofUrl}
                        alt="Bukti Pembayaran"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <a
                    href={transaction.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Lihat Full Size
                  </a>
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-100">
                  <p className="text-sm text-zinc-500">
                    Belum ada bukti pembayaran
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {transaction.status === "pending_verification" && (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isVerifying || isRejecting}
                    className="w-full cursor-pointer rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ✓ Verifikasi Pembayaran
                  </button>
                )}

                {transaction.status === "verified" && (
                  <div className="rounded-lg border-2 border-green-300 bg-green-50 p-4 text-center">
                    <p className="font-semibold text-green-700">
                      ✓ Pembayaran telah diverifikasi
                    </p>
                    <p className="mt-1 text-sm text-green-600">
                      E-Tiket telah dikirim ke email pelanggan
                    </p>
                  </div>
                )}

                {transaction.status === "pending_payment" && (
                  <div className="rounded-lg border-2 border-zinc-300 bg-zinc-50 p-4 text-center">
                    <p className="text-sm text-zinc-600">
                      Menunggu pelanggan melakukan pembayaran
                    </p>
                  </div>
                )}

                {transaction.status === "cancelled" && (
                  <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center">
                    <p className="text-sm font-semibold text-red-700">
                      Pesanan telah dibatalkan
                    </p>
                    <p className="mt-1 text-sm text-red-600">
                      Pesanan dibatalkan secara otomatis atau oleh pembeli.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleVerify}
        title="Verifikasi Pembayaran?"
        description="Apakah Anda yakin ingin memverifikasi pembayaran ini? E-Tiket PDF akan otomatis dikirim ke email pembeli."
        confirmText="Ya, Verifikasi"
        variant="warning"
        isLoading={isVerifying}
      />

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="Tolak Pembayaran?"
        description="Apakah Anda yakin ingin menolak pembayaran ini? Pesanan akan dibatalkan dan kuota tiket akan dikembalikan."
        confirmText="Ya, Tolak"
        variant="danger"
        isLoading={isRejecting}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Berhasil!"
        message={successMessage}
      />
    </div>
  );
}
