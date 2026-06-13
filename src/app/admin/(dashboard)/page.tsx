"use client";

import { useEffect, useState, useRef } from "react";
import { useAdminLayout } from "./layout";
import AdminHeroSection from "@/components/admin/AdminHeroSection";
import MobileMenuButton from "@/components/admin/MobileMenuButton";
import StatusDonutChart from "@/components/admin/StatusDonutChart";
import RevenueChart from "@/components/admin/RevenueChart";
import ExportButton from "@/components/admin/ExportButton";

interface RevenueData {
  eventName: string;
  revenue: number;
}

interface DashboardStats {
  totalTickets: number;
  pendingVerification: number;
  totalRevenue: number;
  statusData: {
    verified: number;
    pending_verification: number;
    pending_payment: number;
  };
  revenueByEvent: RevenueData[];
}

export default function AdminDashboardPage() {
  const { isSidebarOpen, toggleSidebar } = useAdminLayout();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter State
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Generate Year Options
  const yearOptions = [];
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    yearOptions.push(y.toString());
  }

  const isInitialLoad = useRef(true);

  useEffect(() => {
    async function fetchStats() {
      if (isInitialLoad.current) {
        setLoading(true);
        isInitialLoad.current = false;
      }
      try {
        const url = new URL("/api/admin/stats", window.location.origin);
        url.searchParams.set("month", selectedMonth);
        url.searchParams.set("year", selectedYear);

        const response = await fetch(url.toString(), {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (response.ok) {
            setStats(data);
          } else {
            console.error("API returned error:", data);
          }
        } else {
          // If response is not JSON, log the text and don't try to parse it as JSON
          const text = await response.text();
          console.error("Received non-JSON response:", text.substring(0, 200));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div>
        <AdminHeroSection
          title="Dashboard Utama"
          description="Memuat data dashboard..."
        />
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-zinc-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <AdminHeroSection
        title="Dashboard Utama"
        description="Kelola seluruh transaksi tiket LTC Indonesia dengan mudah"
      />

      {/* Mobile Menu Button - Fixed position */}
      <div className="fixed right-4 top-4 z-50 lg:hidden">
        <MobileMenuButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
      </div>

      {/* Content */}
      <div className="space-y-6 p-4 md:p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Filter Periode</h2>
            <p className="text-xs text-zinc-500">Pilih periode data yang ingin ditampilkan</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              aria-label="Pilih Bulan"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 sm:flex-none rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Sepanjang Waktu</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
            <select
              aria-label="Pilih Tahun"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 sm:flex-none rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Semua Tahun</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Bar Chart */}
          <div className="lg:col-span-2">
            {stats && (
              <RevenueChart
                data={stats.revenueByEvent}
                totalRevenue={stats.totalRevenue}
              />
            )}
          </div>

          {/* Donut Chart and Export Button */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {stats && <StatusDonutChart data={stats.statusData} />}
            <div className="flex w-full">
              <div className="w-full [&>button]:w-full">
                <ExportButton selectedMonth={selectedMonth} selectedYear={selectedYear} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
