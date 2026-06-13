"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, CheckCircle, X, Loader2 } from "lucide-react";
import { uploadPaymentProof } from "@/actions/uploadActions";
import SuccessModal from "@/components/modal/SuccessModal";

interface PaymentProofUploadProps {
  orderId: string;
}

export default function PaymentProofUpload({
  orderId,
}: PaymentProofUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Format file tidak didukung. Gunakan PNG, JPG, atau PDF.");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (selectedFile.size > maxSize) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    setError(null);
    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Create FormData and append file
      const formData = new FormData();
      formData.append("file", file);

      // Call Server Action to upload to Cloudinary
      const result = await uploadPaymentProof(formData, orderId);

      if (result.success) {
        // Show success modal
        setShowSuccessModal(true);

        // Redirect after 1 second
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        // Show error message
        setError(result.error || "Gagal mengupload file. Silakan coba lagi.");
        setUploading(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Terjadi kesalahan saat mengupload. Silakan coba lagi.");
      setUploading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <Upload className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900">
          Upload Bukti Pembayaran
        </h3>
      </div>
      <p className="mb-4 text-sm text-zinc-600">
        Setelah melakukan pembayaran, upload bukti transfer Anda untuk
        verifikasi.
      </p>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        id="payment-proof-upload"
        title="Pilih file bukti pembayaran"
        accept="image/jpeg,image/jpg,image/png,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      {!file ? (
        <button
          onClick={handleClickUpload}
          disabled={uploading}
          className="w-full rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center transition-colors hover:border-orange-500 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <Upload className="mx-auto mb-2 h-8 w-8 text-zinc-400" />
          <p className="font-medium text-zinc-700">
            Klik untuk upload bukti pembayaran
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            PNG, JPG atau PDF (Max. 5MB)
          </p>
        </button>
      ) : (
        <div className="space-y-4">
          {/* File Preview */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            {preview ? (
              // Image Preview
              <div className="mb-3 flex justify-center">
                <div className="relative h-48 w-full">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
              </div>
            ) : (
              // PDF Icon
              <div className="mb-3 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-red-100">
                  <svg
                    className="h-12 w-12 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                  </svg>
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-900">
                  {file.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                disabled={uploading}
                aria-label="Hapus file"
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            aria-label="Upload bukti pembayaran"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Upload Bukti Pembayaran
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Message (when no file selected) */}
      {error && !file && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Bukti Pembayaran Berhasil Diunggah!"
        message="Terima kasih! Bukti pembayaran Anda sedang diverifikasi oleh tim kami. Anda akan dialihkan ke halaman utama..."
      />
    </div>
  );
}
