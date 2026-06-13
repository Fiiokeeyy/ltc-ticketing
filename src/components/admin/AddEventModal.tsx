"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { addEvent, updateEvent } from "@/actions/eventActions";
import BaseModal from "@/components/modal/BaseModal";
import { uploadPosterImage } from "@/actions/uploadActions";
import Image from "next/image";

interface TicketCategory {
  categoryName: string;
  price: number;
  stockQuota: number;
}

interface EventData {
  id?: string;
  title: string;
  description: string;
  posterUrl: string;
  showDate: string | Date;
}

interface Props {
  initialData?: EventData;
  triggerType?: "add" | "edit";
}

// Helpers (defined outside component to avoid re-creation on each render)

/** Converts a Date or ISO string to the value format required by <input type="datetime-local"> */
function formatDateTimeLocal(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const EMPTY_TICKET: TicketCategory = { categoryName: "", price: 0, stockQuota: 0 };

function getInitialForm(data?: EventData) {
  return {
    title: data?.title ?? "",
    description: data?.description ?? "",
    posterUrl: data?.posterUrl ?? "",
    showDate: data?.showDate ? formatDateTimeLocal(data.showDate) : "",
  };
}

export default function AddEventModal({
  initialData,
  triggerType = "add",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(() => getInitialForm(initialData));
  const [tickets, setTickets] = useState<TicketCategory[]>([{ ...EMPTY_TICKET }]);

  // Memoize the object URL so it isn't re-created on every render.
  const posterPreviewUrl = useMemo(
    () => (posterFile ? URL.createObjectURL(posterFile) : null),
    [posterFile]
  );

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleOpen = () => {
    setFormData(getInitialForm(initialData));
    setTickets([{ ...EMPTY_TICKET }]);
    setPosterFile(null);
    setIsOpen(true);
  };

  const addTicketCategory = () => {
    setTickets((prev) => [...prev, { ...EMPTY_TICKET }]);
  };

  const removeTicketCategory = (index: number) => {
    if (tickets.length > 1) {
      setTickets((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateTicket = (index: number, field: keyof TicketCategory, value: string | number) => {
    setTickets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImageUrl = formData.posterUrl;

    if (posterFile) {
      setIsUploading(true);
      const fd = new FormData();
      fd.append("file", posterFile);

      const uploadResult = await uploadPosterImage(fd);
      setIsUploading(false);

      if (uploadResult.success && uploadResult.url) {
        uploadedImageUrl = uploadResult.url;
      } else {
        alert(uploadResult.error ?? "Gagal mengupload poster.");
        return;
      }
    }

    startTransition(async () => {
      const payload = {
        ...formData,
        posterUrl: uploadedImageUrl,
        showDate: new Date(formData.showDate),
      };

      const result = initialData?.id
        ? await updateEvent(initialData.id, payload)
        : await addEvent({ ...payload, tickets });

      if (result.success) {
        handleClose();
      } else {
        alert(result.error);
      }
    });
  };

  const isBusy = isPending || isUploading;

  return (
    <>
      {triggerType === "add" ? (
        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Pertunjukan
        </button>
      ) : (
        <button
          onClick={handleOpen}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer w-full"
          title="Edit Pertunjukan"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      )}

      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title={initialData ? "Edit Pertunjukan" : "Tambah Pertunjukan Baru"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Detail Pertunjukan ── */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 font-semibold text-zinc-800">Detail Pertunjukan</h3>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Judul Pertunjukan
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Misal: Teater Bawang Merah Bawang Putih"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Deskripsi</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Deskripsi singkat tentang pertunjukan ini..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Waktu Pertunjukan
              </label>
              <input
                type="datetime-local"
                required
                aria-label="Waktu Pertunjukan"
                value={formData.showDate}
                onChange={(e) => setFormData((p) => ({ ...p, showDate: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* ── Poster Upload ── */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Poster Pertunjukan
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-zinc-300 px-6 py-8">
                <div className="text-center">
                  {posterPreviewUrl || formData.posterUrl ? (
                    <div className="mb-4 flex flex-col items-center gap-4">
                      <div className="relative h-48 w-36 overflow-hidden rounded-lg border border-zinc-200">
                        <Image
                          src={posterPreviewUrl ?? formData.posterUrl}
                          alt="Poster Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPosterFile(null);
                          setFormData((p) => ({ ...p, posterUrl: "" }));
                        }}
                        className="text-sm font-medium text-red-600 hover:text-red-500 cursor-pointer"
                      >
                        Hapus gambar
                      </button>
                    </div>
                  ) : (
                    <>
                      <Plus className="mx-auto h-12 w-12 text-zinc-300" aria-hidden="true" />
                      <div className="mt-4 flex justify-center text-sm leading-6 text-zinc-600">
                        <label
                          htmlFor="poster-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 hover:text-orange-400"
                        >
                          <span>Upload file</span>
                          <input
                            id="poster-upload"
                            name="poster-upload"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                alert("File terlalu besar. Maksimal 5MB.");
                                return;
                              }
                              setPosterFile(file);
                            }}
                          />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-zinc-500">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Kategori Tiket (Add mode only) ── */}
          {!initialData && (
            <div className="space-y-4">
              <h3 className="border-b pb-2 font-semibold text-zinc-800">Kategori Tiket</h3>
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                >
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-zinc-700">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      required
                      value={ticket.categoryName}
                      onChange={(e) => updateTicket(index, "categoryName", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="Misal: VIP"
                    />
                  </div>
                  <div className="w-32">
                    <label className="mb-1 block text-xs font-medium text-zinc-700">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={ticket.price || ""}
                      onChange={(e) => updateTicket(index, "price", parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium text-zinc-700">Kuota</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="0"
                      value={ticket.stockQuota || ""}
                      onChange={(e) =>
                        updateTicket(index, "stockQuota", parseInt(e.target.value) || 0)
                      }
                      className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      aria-label="Hapus Kategori Tiket"
                      onClick={() => removeTicketCategory(index)}
                      className="mb-0.5 rounded-lg p-2 text-red-500 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTicketCategory}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Tambah Kategori Tiket
              </button>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
            >
              {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUploading ? "Mengupload..." : "Simpan Pertunjukan"}
            </button>
          </div>
        </form>
      </BaseModal>
    </>
  );
}
