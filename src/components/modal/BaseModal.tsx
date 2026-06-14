"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "2xl",
}: BaseModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling on body when modal is open
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

  if (!isOpen || !mounted) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div 
        className={`w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (Scrollable if content is too long) */}
        <div className="overflow-y-auto p-6 flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
