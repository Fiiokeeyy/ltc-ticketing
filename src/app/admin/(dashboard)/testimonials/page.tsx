import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Star, MessageSquare } from "lucide-react";
import AdminHeroSection from "@/components/admin/AdminHeroSection";
import MobileMenuButtonWrapper from "@/components/admin/MobileMenuButtonWrapper";
import TestimonialActions from "@/components/admin/TestimonialActions";
import DonutChart from "@/components/admin/DonutChart";

export const dynamic = "force-dynamic";

// Helper: render bintang rating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-zinc-500">{rating}/5</span>
    </div>
  );
}

// Helper: badge status
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:
      "bg-amber-50 text-amber-700 border border-amber-200",
    approved:
      "bg-green-50 text-green-700 border border-green-200",
    rejected:
      "bg-red-50 text-red-700 border border-red-200",
  };
  const labels: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default async function AdminTestimonialsPage() {
  const allTestimonials = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt));

  const counts = {
    total: allTestimonials.length,
    pending: allTestimonials.filter((t) => t.status === "pending").length,
    approved: allTestimonials.filter((t) => t.status === "approved").length,
    rejected: allTestimonials.filter((t) => t.status === "rejected").length,
  };

  return (
    <div>
      {/* Hero Section */}
      <AdminHeroSection
        title="Moderasi Ulasan"
        description="Tinjau dan kelola ulasan dari pengunjung"
      />

      {/* Mobile Menu Button - Fixed position */}
      <MobileMenuButtonWrapper />

      {/* Content */}
      <div className="space-y-6 p-4 md:p-8">

        {/* Summary Cards */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <h3 className="text-base font-semibold text-zinc-900">Statistik Ulasan</h3>
            </div>
            <span className="text-xs font-medium text-zinc-500">Total: {counts.total}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-zinc-100">
              <DonutChart value={counts.total} total={counts.total} colorClass="text-blue-500" label="TOTAL ULASAN" />
            </div>
            <div className="rounded-xl border border-zinc-100">
              <DonutChart value={counts.pending} total={counts.total} colorClass="text-amber-500" label="MENUNGGU" />
            </div>
            <div className="rounded-xl border border-zinc-100">
              <DonutChart value={counts.approved} total={counts.total} colorClass="text-green-500" label="DISETUJUI" />
            </div>
            <div className="rounded-xl border border-zinc-100">
              <DonutChart value={counts.rejected} total={counts.total} colorClass="text-red-500" label="DITOLAK" />
            </div>
          </div>
        </div>

        {/* Table */}
        {allTestimonials.length === 0 ? (
          // Empty State
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white">
            <div className="text-center">
              <MessageSquare className="mx-auto h-16 w-16 text-zinc-300" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                Belum ada ulasan yang masuk
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Ulasan dari pengunjung akan muncul di sini setelah mereka
                mengirimkannya.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Nama Pengunjung
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Isi Ulasan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {allTestimonials.map((testimonial) => (
                    <tr
                      key={testimonial.id}
                      className="transition-colors hover:bg-zinc-50"
                    >
                      {/* Nama */}
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="max-w-[120px] pt-2 truncate text-sm font-medium text-zinc-900">
                            {testimonial.name}
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-4 align-top pt-6">
                        <StarRating rating={testimonial.rating} />
                      </td>

                      {/* Isi Ulasan */}
                      <td className="min-w-[200px] max-w-[400px] px-4 py-4 align-top">
                        <p className="text-sm text-zinc-600 whitespace-pre-wrap">
                          {testimonial.message}
                        </p>
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-4 align-top pt-6">
                        <span className="whitespace-nowrap text-xs text-zinc-500">
                          {new Date(testimonial.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 align-top pt-6">
                        <StatusBadge status={testimonial.status} />
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-4 align-top pt-5">
                        <TestimonialActions
                          id={testimonial.id}
                          currentStatus={testimonial.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-zinc-100 md:hidden">
              {allTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {new Date(testimonial.createdAt).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={testimonial.status} />
                  </div>
                  <StarRating rating={testimonial.rating} />
                  <p className="text-sm text-zinc-600 whitespace-pre-wrap">
                    {testimonial.message}
                  </p>
                  <TestimonialActions
                    id={testimonial.id}
                    currentStatus={testimonial.status}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
