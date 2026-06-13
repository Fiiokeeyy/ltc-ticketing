"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEvent } from "@/actions/eventActions";
import ConfirmModal from "@/components/modal/ConfirmModal";

export default function DeleteEventButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEvent(id);
      if (!result.success) {
        alert(result.error);
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50 cursor-pointer h-full"
        title="Hapus Pertunjukan"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Pertunjukan"
        description="Apakah Anda yakin ingin menghapus pertunjukan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={isPending}
        variant="danger"
      />
    </>
  );
}
