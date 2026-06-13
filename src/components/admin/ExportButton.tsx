"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportButtonProps {
  selectedMonth: string;
  selectedYear: string;
}

export default function ExportButton({ selectedMonth, selectedYear }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // 1. Fetch raw data tailored for export
      const url = new URL("/api/admin/export", window.location.origin);
      url.searchParams.set("month", selectedMonth);
      url.searchParams.set("year", selectedYear);

      const response = await fetch(url.toString(), { cache: "no-store" });
      const { success, data, error } = await response.json();

      if (!success) {
        alert(error || "Gagal mengambil data untuk export.");
        return;
      }

      if (data.length === 0) {
        alert("Tidak ada data transaksi pada periode ini untuk di-export.");
        return;
      }

      // 2. Format the date beautifully for Excel
      const formattedData = data.map((row: Record<string, unknown> & { waktu: string | number | Date }) => ({
        ...row,
        waktu: new Date(row.waktu).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // 3. Dynamically import xlsx ONLY when button is clicked (keeps initial bundle small & lightweight)
      const XLSX = await import("xlsx");

      // 4. Create Workbook and Worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan");

      // 5. Generate descriptive filename
      const monthLabel = selectedMonth === "all" ? "Semua_Bulan" : `Bulan_${selectedMonth}`;
      const yearLabel = selectedYear === "all" ? "Semua_Tahun" : `Tahun_${selectedYear}`;
      const fileName = `Laporan_Keuangan_LTC_${monthLabel}_${yearLabel}.xlsx`;

      // 6. Trigger Download
      XLSX.writeFile(workbook, fileName);

    } catch (err) {
      console.error("Export Error:", err);
      alert("Terjadi kesalahan sistem saat memproses export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 cursor-pointer"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Memproses...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Export Excel
        </>
      )}
    </button>
  );
}
