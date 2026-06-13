"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Tidak tampilkan Navbar/Footer untuk route admin (termasuk /admin/login)
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Render Navbar and Footer for all other routes
  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      {children}
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
