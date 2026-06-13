"use client";

import { useState, createContext, useContext } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(
  undefined,
);

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminLayout");
  }
  return context;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <AdminLayoutContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div className="flex min-h-screen bg-zinc-50">
        {/* Left Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </AdminLayoutContext.Provider>
  );
}
