"use client";

import { useTransition } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { updateTestimonialStatus } from "@/actions/testimonialActions";

interface TestimonialActionsProps {
  id: string;
  currentStatus: string;
}

export default function TestimonialActions({
  id,
  currentStatus,
}: TestimonialActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await updateTestimonialStatus(id, "approved");
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await updateTestimonialStatus(id, "rejected");
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Tombol Setujui */}
      {currentStatus !== "approved" && (
        <button
          onClick={handleApprove}
          disabled={isPending}
          title="Setujui Ulasan"
          className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-all hover:bg-green-100 hover:border-green-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          <span>Setujui</span>
        </button>
      )}

      {/* Tombol Tolak */}
      {currentStatus !== "rejected" && (
        <button
          onClick={handleReject}
          disabled={isPending}
          title="Tolak Ulasan"
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-all hover:bg-red-100 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          <span>Tolak</span>
        </button>
      )}

      {/* Tampilkan label jika sudah di-approve atau di-reject dan tidak ada tombol */}
      {currentStatus === "approved" && !isPending && (
        <span className="text-xs text-green-600 font-medium">✓ Disetujui</span>
      )}
      {currentStatus === "rejected" && !isPending && (
        <span className="text-xs text-red-600 font-medium">✗ Ditolak</span>
      )}
    </div>
  );
}
