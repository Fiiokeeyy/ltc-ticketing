"use client";

import BaseModal from "@/components/modal/BaseModal";
import { Loader2, User, Mail, Phone, Landmark, CreditCard, QrCode } from "lucide-react";
import { PaymentMethod } from "@/db/schema";

interface ConfirmCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  formData: {
    name: string;
    email: string;
    whatsapp: string;
    quantity: number;
    paymentMethodId: string;
  };
  selectedTicket: {
    categoryName: string;
    price: number;
  } | undefined;
  paymentMethods: PaymentMethod[];
}

export default function ConfirmCheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  formData,
  selectedTicket,
  paymentMethods,
}: ConfirmCheckoutModalProps) {
  if (!selectedTicket) return null;

  const total = selectedTicket.price * formData.quantity;
  const selectedPayment = paymentMethods.find((p) => p.id === formData.paymentMethodId);
  
  const PaymentIcon = selectedPayment?.type === 'qris' 
    ? QrCode 
    : selectedPayment?.type === 'bank_transfer' 
      ? Landmark 
      : CreditCard;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Konfirmasi Pesanan"
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="rounded-xl bg-orange-50 p-4 text-sm text-orange-800">
          <p>Pastikan data di bawah ini sudah benar. E-Tiket akan dikirimkan ke alamat email yang tertera.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="font-semibold text-zinc-900 border-b border-zinc-200 pb-2">Detail Data Diri</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Nama Lengkap</p>
                <p className="font-medium text-zinc-900">{formData.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Email</p>
                <p className="font-medium text-zinc-900">{formData.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">WhatsApp</p>
                <p className="font-medium text-zinc-900">{formData.whatsapp}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="font-semibold text-zinc-900 border-b border-zinc-200 pb-2">Detail Pembayaran</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Tiket</span>
              <span className="font-medium text-zinc-900 text-right">
                {selectedTicket.categoryName} <br/> (x{formData.quantity})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Metode</span>
              <span className="font-medium text-zinc-900 flex items-center gap-1.5">
                {PaymentIcon && <PaymentIcon className="w-4 h-4 text-zinc-500"/>}
                {selectedPayment?.name || '-'}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold">
              <span className="text-zinc-900">Total</span>
              <span className="text-orange-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 cursor-pointer"
          >
            Ubah Data
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Konfirmasi & Bayar"
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
