"use client";

import { AlertCircle, Loader2, CheckCircle, Info } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "success" | "info";
}

// Defined outside the component — not re-created on every render
const VARIANT_CONFIG = {
  danger: {
    icon: <AlertCircle className="h-8 w-8 text-red-600" />,
    bgIcon: "bg-red-100",
    btnConfirm: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: <AlertCircle className="h-8 w-8 text-orange-500" />,
    bgIcon: "bg-orange-100",
    btnConfirm: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  success: {
    icon: <CheckCircle className="h-8 w-8 text-green-500" />,
    bgIcon: "bg-green-100",
    btnConfirm: "bg-green-600 hover:bg-green-700 text-white",
  },
  info: {
    icon: <Info className="h-8 w-8 text-blue-500" />,
    bgIcon: "bg-blue-100",
    btnConfirm: "bg-blue-600 hover:bg-blue-700 text-white",
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isLoading = false,
  variant = "warning",
}: ConfirmModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { icon, bgIcon, btnConfirm } = VARIANT_CONFIG[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex justify-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgIcon}`}>
            {icon}
          </div>
        </div>

        <h3 className="mb-2 text-center text-xl font-bold text-zinc-900">{title}</h3>
        <p className="mb-6 text-center text-sm text-zinc-600">{description}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label={cancelText}
            className="flex-1 cursor-pointer rounded-lg bg-zinc-100 px-4 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            aria-label={confirmText}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${btnConfirm}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
