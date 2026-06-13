"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Minus,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  QrCode,
  Landmark,
  CreditCard,
} from "lucide-react";
import { createTransaction } from "@/actions/transactionActions";
import { PaymentMethod } from "@/db/schema";
import SuccessModal from "@/components/modal/SuccessModal";

interface Event {
  id: string;
  title: string;
  description: string | null;
  posterUrl: string | null;
  showDate: Date;
  createdAt: Date;
}

interface Ticket {
  id: string;
  eventId: string;
  categoryName: string;
  price: number;
  stockQuota: number;
}

interface CheckoutClientProps {
  event: Event;
  ticketCategories: Ticket[];
  paymentMethods: PaymentMethod[];
}

export default function CheckoutClient({
  event,
  ticketCategories,
  paymentMethods,
}: CheckoutClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    categoryId: ticketCategories[0]?.id || "",
    quantity: 1,
    paymentMethod: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleQuantityChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  // Form validation
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.whatsapp.trim() !== "" &&
    formData.paymentMethod !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Get selected ticket category
      const selectedTicket = ticketCategories.find(
        (t) => t.id === formData.categoryId,
      );

      if (!selectedTicket) {
        setErrorMessage("Kategori tiket tidak ditemukan");
        setIsSubmitting(false);
        return;
      }

      const total = selectedTicket.price * formData.quantity;

      // Create transaction using Server Action
      const result = await createTransaction({
        eventId: event.id,
        customerName: formData.name,
        customerEmail: formData.email,
        customerWhatsapp: formData.whatsapp,
        ticketCategory: selectedTicket.categoryName,
        ticketQuantity: formData.quantity,
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
      });

      if (result.success && result.orderId) {
        // Show success modal
        setShowSuccessModal(true);

        // Redirect after 1 second
        setTimeout(() => {
          router.push(`/payment/${result.orderId}`);
        }, 1000);
      } else {
        setErrorMessage("Gagal membuat pesanan. Silakan coba lagi.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  // Get selected category
  const selectedTicket = ticketCategories.find(
    (t) => t.id === formData.categoryId,
  );
  const ticketPrice = selectedTicket?.price || 0;
  const subtotal = ticketPrice * formData.quantity;
  const total = subtotal;

  // Format date
  const dateStr = new Date(event.showDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = new Date(event.showDate).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 md:pb-24">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column - Form */}
        <div className="lg:col-span-7">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Data Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900">
                Data Pemesan
              </h2>

              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-11 pr-4 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-11 pr-4 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* WhatsApp Input */}
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="tel"
                      id="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-11 pr-4 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>

                {/* Ticket Category Select */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Kategori Tiket
                  </label>
                  <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white py-3 px-4 text-zinc-900 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    {ticketCategories.map((ticket) => (
                      <option key={ticket.id} value={ticket.id}>
                        {ticket.categoryName} - Rp{" "}
                        {ticket.price.toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Counter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Jumlah Tiket
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      aria-label="Kurangi jumlah tiket"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-12 text-center text-2xl font-bold text-zinc-900">
                      {formData.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      aria-label="Tambah jumlah tiket"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mt-6 border-t border-zinc-200 pt-6">
                  <label className="mb-3 block text-sm font-medium text-zinc-700">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {paymentMethods.map((method) => {
                      const Icon =
                        method.type === "qris"
                          ? QrCode
                          : method.type === "bank_transfer"
                            ? Landmark
                            : CreditCard;
                      const isSelected = formData.paymentMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paymentMethod: method.id,
                            })
                          }
                          className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all cursor-pointer ${
                            isSelected
                              ? "border-orange-500 bg-orange-50 text-orange-500 ring-1 ring-orange-500"
                              : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-medium text-center">
                            {method.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button - Mobile Only (Inside Form) */}
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="mt-6 w-full rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-orange-500 lg:hidden cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  "Buat Pesanan Sekarang"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Summary (Sticky) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            {/* Order Summary Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-zinc-900">
                Ringkasan Pesanan
              </h2>

              {/* Event Info */}
              <div className="mb-6 flex gap-4">
                {event.posterUrl && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={event.posterUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-zinc-900">
                    {event.title}
                  </h3>
                  <div className="space-y-1 text-xs text-zinc-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{timeStr} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>LTC Indonesia</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 border-t border-zinc-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Kategori Tiket</span>
                  <span className="font-medium text-zinc-900">
                    {selectedTicket?.categoryName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">
                    Harga Tiket x {formData.quantity}
                  </span>
                  <span className="font-medium text-zinc-900">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-3">
                  <span className="text-lg font-bold text-zinc-900">
                    Total Pembayaran
                  </span>
                  <span className="text-lg font-bold text-orange-500">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button - Desktop (Outside Form, triggers form submission) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (formRef.current) {
                  formRef.current.requestSubmit();
                }
              }}
              disabled={isSubmitting || !isFormValid}
              className="hidden w-full rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-orange-500 lg:block cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Buat Pesanan Sekarang"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Pesanan Berhasil Dibuat!"
        message="Email konfirmasi telah dikirim. Anda akan dialihkan ke halaman pembayaran..."
      />
    </div>
  );
}
