"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAdminLayout } from "../layout";
import AdminHeroSection from "@/components/admin/AdminHeroSection";
import MobileMenuButton from "@/components/admin/MobileMenuButton";
import TransactionRow from "@/components/admin/TransactionRow";
import { Search, Filter } from "lucide-react";

interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  eventTitle: string;
  ticketCategory: string;
  ticketQuantity: number;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  paymentProofUrl: string | null;
  createdAt: Date;
}

export default function AdminTransactionsPage() {
  const { isSidebarOpen, toggleSidebar } = useAdminLayout();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to fetch transactions with useCallback
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/transactions", {
        cache: "no-store", // Prevent caching
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || "Failed to fetch transactions");
        }
        
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Expected array but got:", data);
          setTransactions([]);
        }
      } else {
        const text = await response.text();
        console.error("Received non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned an invalid response (not JSON)");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]); // Pastikan state tetap array meskipun error
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger refresh from child components
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [refreshTrigger, fetchTransactions]);

  // Filter transactions based on search and status using useMemo
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.customerName || "").toLowerCase().includes(query) ||
          (t.id || "").toLowerCase().includes(query) ||
          (t.customerEmail || "").toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    return filtered;
  }, [searchQuery, statusFilter, transactions]);

  return (
    <div>
      {/* Hero Section */}
      <AdminHeroSection
        title="Kelola Transaksi Tiket"
        description="Verifikasi pembayaran dan kelola pesanan tiket"
      />

      {/* Mobile Menu Button - Fixed position */}
      <div className="fixed right-4 top-4 z-50 lg:hidden">
        <MobileMenuButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
      </div>

      {/* Content */}
      <div className="space-y-6 p-4 md:p-8">
        {/* Header & Filters - Removed redundant title since it's in hero */}
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari nama pembeli atau ID pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-zinc-600" />
              <select
                aria-label="Filter status transaksi"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="all">Semua Status</option>
                <option value="pending_payment">Menunggu Pembayaran</option>
                <option value="pending_verification">
                  Menunggu Verifikasi
                </option>
                <option value="verified">Terverifikasi</option>
                <option value="cancelled">Dibatalkan</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              Menampilkan{" "}
              <span className="font-semibold text-zinc-900">
                {filteredTransactions.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-zinc-900">
                {transactions.length}
              </span>{" "}
              transaksi
            </p>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-zinc-600">Memuat transaksi...</p>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white">
            <div className="text-center">
              <p className="text-lg font-semibold text-zinc-900">
                Tidak ada transaksi ditemukan
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Coba ubah filter atau kata kunci pencarian
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 md:block">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-zinc-700">
                <div className="col-span-2">ID Pesanan</div>
                <div className="col-span-2">Nama Pembeli</div>
                <div className="col-span-3">Kategori & Jumlah</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-center">Detail</div>
              </div>
            </div>

            {/* Transaction Rows */}
            {filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onVerifySuccess={triggerRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
