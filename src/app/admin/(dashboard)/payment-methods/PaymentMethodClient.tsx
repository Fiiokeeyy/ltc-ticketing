"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { PaymentMethod } from "@/db/schema";
import BaseModal from "@/components/modal/BaseModal";
import { 
  deletePaymentMethod, 
  togglePaymentMethodStatus, 
  createPaymentMethod, 
  updatePaymentMethod 
} from "@/actions/paymentMethodActions";
import { uploadQrisImage } from "@/actions/uploadActions";
import Image from "next/image";
import ConfirmModal from "@/components/modal/ConfirmModal";

interface PaymentMethodClientProps {
  initialPaymentMethods: PaymentMethod[];
}

const EMPTY_FORM = {
  id: "",
  name: "",
  type: "bank_transfer",
  instruction: "",
  accountNumber: "",
  accountName: "",
  qrImageUrl: "",
  isActive: true,
};

export default function PaymentMethodClient({ initialPaymentMethods }: PaymentMethodClientProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteMethodId, setDeleteMethodId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const handleOpenModal = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        id: method.id,
        name: method.name,
        type: method.type,
        instruction: method.instruction,
        accountNumber: method.accountNumber || "",
        accountName: method.accountName || "",
        qrImageUrl: method.qrImageUrl || "",
        isActive: method.isActive,
      });
    } else {
      setEditingMethod(null);
      setFormData({ ...EMPTY_FORM });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
    setQrisFile(null);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const result = await togglePaymentMethodStatus(id, currentStatus);
    if (result.success) {
      setMethods(methods.map(m => m.id === id ? { ...m, isActive: !currentStatus } : m));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteMethodId(id);
  };

  const confirmDelete = async () => {
    if (!deleteMethodId) return;
    setIsDeleting(true);
    const result = await deletePaymentMethod(deleteMethodId);
    if (result.success) {
      setMethods(methods.filter(m => m.id !== deleteMethodId));
    }
    setIsDeleting(false);
    setDeleteMethodId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let uploadedImageUrl = formData.qrImageUrl;

    if (formData.type === 'qris' && qrisFile) {
      setIsUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", qrisFile);
        const uploadResult = await uploadQrisImage(fd);
        if (uploadResult.success && uploadResult.url) {
          uploadedImageUrl = uploadResult.url;
        } else {
          alert(uploadResult.error || "Gagal mengupload gambar QRIS.");
          return;
        }
      } finally {
        setIsUploading(false);
      }
    }

    const dataToSave = {
      id: formData.id || crypto.randomUUID().slice(0, 8),
      name: formData.name,
      type: formData.type,
      instruction: formData.instruction,
      accountNumber: (formData.type === 'bank_transfer' || formData.type === 'e_wallet') ? formData.accountNumber : null,
      accountName: (formData.type === 'bank_transfer' || formData.type === 'e_wallet') ? formData.accountName : null,
      qrImageUrl: formData.type === 'qris' ? uploadedImageUrl : null,
      isActive: formData.isActive,
    };

    if (editingMethod) {
      const result = await updatePaymentMethod(editingMethod.id, dataToSave);
      if (result.success) {
        setMethods(methods.map(m => m.id === editingMethod.id ? { ...m, ...dataToSave } as PaymentMethod : m));
        handleCloseModal();
      }
    } else {
      const result = await createPaymentMethod(dataToSave);
      if (result.success) {
        setMethods([{ ...dataToSave, createdAt: new Date() } as PaymentMethod, ...methods]);
        handleCloseModal();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Daftar Metode Pembayaran</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Baru
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <div key={method.id} className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900">{method.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">{method.type.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={() => handleToggle(method.id, method.isActive)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    method.isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {method.isActive ? "Aktif" : "Nonaktif"}
                </button>
              </div>

              <p className="mb-4 text-sm text-zinc-600 line-clamp-2">{method.instruction}</p>

              {method.type === 'qris' && method.qrImageUrl && (
                <div className="mb-4 aspect-video w-full rounded bg-zinc-100 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${method.qrImageUrl})` }} />
              )}

              {(method.type === 'bank_transfer' || method.type === 'e_wallet') && (
                <div className="mb-4 rounded-lg bg-zinc-50 p-3 text-sm">
                  <p className="font-mono font-semibold text-zinc-900">{method.accountNumber}</p>
                  <p className="text-xs text-zinc-600">a.n. {method.accountName}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-zinc-100 pt-4">
              <button
                onClick={() => handleOpenModal(method)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(method.id)}
                aria-label="Hapus metode pembayaran"
                title="Hapus"
                className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMethod ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}
        maxWidth="lg"
      >

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">ID (Kode Pendek)</label>
                  <input
                    required
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={!!editingMethod}
                    className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm disabled:bg-zinc-100 disabled:text-zinc-500"
                    placeholder="Contoh: bca, gopay"
                  />
                </div>
                <div>
                  <label htmlFor="methodType" className="mb-1 block text-sm font-medium text-zinc-700">Tipe</label>
                  <select
                    id="methodType"
                    title="Tipe Metode Pembayaran"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="qris">QRIS</option>
                    <option value="e_wallet">E-Wallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Nama Tampilan</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm"
                  placeholder="Contoh: Transfer BCA"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Instruksi Pembayaran</label>
                <textarea
                  required
                  rows={2}
                  value={formData.instruction}
                  onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm"
                  placeholder="Contoh: Transfer ke rekening berikut sebelum waktu habis."
                />
              </div>

              {(formData.type === 'bank_transfer' || formData.type === 'e_wallet') && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      {formData.type === 'bank_transfer' ? 'Nomor Rekening' : 'Nomor Akun / HP'}
                    </label>
                    <input
                      required={(formData.type === 'bank_transfer' || formData.type === 'e_wallet')}
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm"
                      placeholder={formData.type === 'bank_transfer' ? '1234567890' : '081234567890'}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Nama Pemilik (A.N)</label>
                    <input
                      required={(formData.type === 'bank_transfer' || formData.type === 'e_wallet')}
                      type="text"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm"
                      placeholder="PT. LTC Indonesia"
                    />
                  </div>
                </div>
              )}

              {formData.type === 'qris' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Gambar QRIS</label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-zinc-300 px-6 py-8">
                    <div className="text-center">
                      {(qrisFile || formData.qrImageUrl) ? (
                        <div className="mb-4 flex flex-col items-center gap-4">
                          <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-zinc-200">
                            <Image
                              src={qrisFile ? URL.createObjectURL(qrisFile) : formData.qrImageUrl}
                              alt="QRIS Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setQrisFile(null);
                              setFormData(prev => ({ ...prev, qrImageUrl: "" }));
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-500 cursor-pointer"
                          >
                            Hapus gambar
                          </button>
                        </div>
                      ) : (
                        <>
                          <Plus className="mx-auto h-12 w-12 text-zinc-300" aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-zinc-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 hover:text-orange-400"
                            >
                              <span>Upload file</span>
                              <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      alert("File terlalu besar. Maksimal 5MB.");
                                      return;
                                    }
                                    setQrisFile(file);
                                  }
                                }}
                                required={formData.type === 'qris' && !formData.qrImageUrl}
                              />
                            </label>
                            <p className="pl-1">atau drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-zinc-600">PNG, JPG, up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-zinc-700">
                  Metode Aktif & Dapat Digunakan
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUploading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
        </form>
      </BaseModal>
      <ConfirmModal
        isOpen={!!deleteMethodId}
        title="Hapus Metode Pembayaran?"
        description="Apakah Anda yakin ingin menghapus metode pembayaran ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
        onClose={() => setDeleteMethodId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
