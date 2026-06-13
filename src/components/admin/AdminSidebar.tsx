"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminRole } from "@/actions/authActions";
import {
  LayoutDashboard,
  Receipt,
  MessageSquare,
  Ticket,
  X,
  LogOut,
  ScanLine,
  Lock,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getAdminRole().then(setRole);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    {
      href: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard Utama",
    },
    {
      href: "/admin/transactions",
      icon: Receipt,
      label: "Kelola Tiket",
    },
    {
      href: "/admin/testimonials",
      icon: MessageSquare,
      label: "Moderasi Ulasan",
    },
    {
      href: "/admin/events",
      icon: Ticket,
      label: "Kelola Event",
    },
    {
      href: "/admin/payment-methods",
      icon: Receipt, // Or any other suitable icon
      label: "Metode Pembayaran",
    },
    {
      href: "/admin/scanner",
      icon: ScanLine,
      label: "Scan Tiket (Gate)",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-50 h-[100dvh] w-72 bg-zinc-950 text-white transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Brand */}
          <div className="flex items-center justify-center border-b border-zinc-800 p-6 lg:justify-start">
            <div className="flex items-center gap-3">
              <Image
                src="/ltc-logo.jpeg"
                alt="LTC Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain"
              />
              <div>
                <h1 className="text-lg font-bold">LTC Indonesia</h1>
                <p className="text-xs text-zinc-400">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="border-b border-zinc-800 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-500 text-lg font-bold shadow-lg">
                A
              </div>
              <div>
                <p className="font-semibold">Halo, Admin!</p>
                <p className="text-xs text-zinc-400">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const isLocked = role === "gate" && item.href !== "/admin/scanner";

              return isLocked ? (
                <div
                  key={item.href}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-zinc-600 opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-zinc-800 p-4 space-y-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
