import AdminHeroSection from "@/components/admin/AdminHeroSection";
import PaymentMethodClient from "./PaymentMethodClient";
import { getPaymentMethods } from "@/actions/paymentMethodActions";
import MobileMenuButtonWrapper from "@/components/admin/MobileMenuButtonWrapper";

export default async function AdminPaymentMethodsPage() {
  const result = await getPaymentMethods();
  const paymentMethods = result.success && result.data ? result.data : [];

  return (
    <div>
      <AdminHeroSection
        title="Metode Pembayaran"
        description="Kelola daftar metode pembayaran yang tersedia untuk customer"
      />
      <MobileMenuButtonWrapper />
      <div className="p-4 md:p-8">
        <PaymentMethodClient initialPaymentMethods={paymentMethods} />
      </div>
    </div>
  );
}
