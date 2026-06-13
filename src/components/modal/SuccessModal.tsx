"use client";

import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
}

export default function SuccessModal({
  isOpen,
  title,
  message,
}: SuccessModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-center text-2xl font-bold text-zinc-900">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-base leading-relaxed text-zinc-600">
          {message}
        </p>

        {/* Loading Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
