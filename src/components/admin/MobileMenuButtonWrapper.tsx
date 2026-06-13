"use client";

import { useAdminLayout } from "@/app/admin/(dashboard)/layout";
import MobileMenuButton from "@/components/admin/MobileMenuButton";

// File ini adalah component untuk menampilkan tombol mobile menu di halaman admin
export default function MobileMenuButtonWrapper() {
  const { isSidebarOpen, toggleSidebar } = useAdminLayout();

  return (
    <div className="fixed right-4 top-4 z-50 lg:hidden">
      <MobileMenuButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
    </div>
  );
}
