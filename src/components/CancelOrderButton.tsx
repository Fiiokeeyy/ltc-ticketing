"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { cancelTransaction } from "@/actions/transactionActions";
import BaseModal from "@/components/modal/BaseModal";

interface CancelOrderButtonProps {
  orderId: string;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    setIsSubmitting(true);
    
    const result = await cancelTransaction(orderId);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setIsModalOpen(false);
      // Refresh the page to reflect the new cancelled status
      router.refresh();
    } else {
      alert("Gagal membatalkan pesanan. Silakan coba lagi nanti.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 cursor-pointer"
      >
        <XCircle className="h-5 w-5" />
        Batalkan Pesanan
      </button>

      <BaseModal
        isOpen={isModalOpen}
        onClose={isSubmitting ? () => {} : () => setIsModalOpen(false)}
        title="Batalkan Pesanan?"
        maxWidth="sm"
      >
        <div className="space-y-6">
          <p className="text-zinc-600 text-sm">
            Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan dan tiket Anda akan hangus.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 cursor-pointer"
            >
              Tidak, Kembali
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Batalkan"
              )}
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
