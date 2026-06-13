"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { submitTestimonial } from "@/actions/testimonialActions";
import SuccessModal from "@/components/modal/SuccessModal";
import PageHero from "@/components/PageHero";

export default function TulisUlasanPage() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    if (rating === 0) {
      setError("Silakan pilih rating bintang");
      return;
    }

    if (!message.trim()) {
      setError("Ulasan tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitTestimonial({
        name: name.trim(),
        rating,
        message: message.trim(),
      });

      if (result.success) {
        // Show success modal
        setShowSuccessModal(true);

        // Redirect after 1 second
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        icon={<MessageSquare className="h-12 w-12 text-orange-500" />}
        title="Bagikan Pengalaman Anda"
        description={
          <>Ceritakan kesan dan pengalaman Anda bersama{" "}<span className="font-semibold text-orange-500">LTC Indonesia</span></>
        }
        maxWidth="xl"
      />

      {/* Form Section */}
      <div className="mx-auto max-w-xl px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Masukkan nama lengkap Anda"
              maxLength={255}
            />
          </div>

          {/* Rating Stars */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`Rating ${star} stars`}
                  disabled={isSubmitting}
                  className="transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Star
                    className={`h-10 w-10 transition-colors cursor-pointer ${
                      star <= (hover || rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-zinc-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-zinc-600">
                  {rating} bintang
                </span>
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Ulasan / Kesan Pesan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              rows={6}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ceritakan pengalaman Anda menonton pertunjukan di LTC Indonesia..."
              maxLength={1000}
            />
            <p className="mt-2 text-xs text-zinc-500">
              {message.length}/1000 karakter
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-orange-500 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Mengirim...
              </span>
            ) : (
              "Kirim Ulasan"
            )}
          </button>

          {/* Info Text */}
          <p className="text-center text-sm text-zinc-500">
            Ulasan Anda akan ditinjau oleh admin terlebih dahulu sebelum
            ditampilkan di website
          </p>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Ulasan Berhasil Dikirim!"
        message="Terima kasih atas apresiasi Anda. Ulasan akan ditinjau oleh admin terlebih dahulu. Anda akan dialihkan ke halaman utama..."
      />
    </div>
  );
}
