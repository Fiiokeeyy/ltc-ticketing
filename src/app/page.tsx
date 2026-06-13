import Link from "next/link";
import { Ticket } from "lucide-react";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import WorkflowSection from "@/components/WorkflowSection";
import TestimonialSlider from "@/components/TestimonialSlider";
import PageHero from "@/components/PageHero";
import ScrollAnimation from "@/components/ScrollAnimation";

export default async function Home() {
  const approvedTestimonials = await db
    .select({
      id: testimonials.id,
      name: testimonials.name,
      rating: testimonials.rating,
      message: testimonials.message,
    })
    .from(testimonials)
    .where(eq(testimonials.status, "approved"))
    .orderBy(desc(testimonials.createdAt));

  return (
    <div className="bg-white">
      <PageHero
        badge="Official Ticketing Partner"
        title={
          <><span className="text-orange-500">E-Ticketing </span>LTC Indonesia</>
        }
        description="Platform pemesanan tiket resmi untuk pertunjukan teater LTC Indonesia. Nikmati pengalaman seni yang memukau dengan proses pemesanan yang mudah dan cepat."
        maxWidth="4xl"
        size="large"
      >
        <Link
          href="/tiket"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-3 font-medium text-white shadow-md transition-colors hover:bg-orange-600"
        >
          <Ticket className="h-5 w-5" />
          Pesan Tiket Sekarang
        </Link>
      </PageHero>

      {/* Workflow Section */}
      <ScrollAnimation delay={100}>
        <WorkflowSection />
      </ScrollAnimation>

      {/* Testimonial Section — hanya tampil jika ada ulasan yang disetujui */}
      {approvedTestimonials.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <ScrollAnimation direction="up">
              {/* Section Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                  Apa Kata
                  <span className="text-orange-500"> Penonton</span> Kami?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
                  Testimoni dari pelanggan yang puas dengan layanan kami
                </p>
              </div>
            </ScrollAnimation>

            {/* 3D Card Slider */}
            <ScrollAnimation direction="up" delay={200} className="mt-16">
              <TestimonialSlider testimonials={approvedTestimonials} />
            </ScrollAnimation>
          </div>
        </section>
      )}
    </div>
  );
}
