import { ShieldCheck, Zap, Smartphone } from "lucide-react";

export default function WorkflowSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Transaksi Aman & Terenkripsi",
      description:
        "Proses pembayaran diverifikasi secara real-time dengan sistem keamanan tinggi. Data pribadi dan pesanan Anda dijamin kerahasiaannya.",
      gradient: "from-orange-500/10 to-red-500/10",
    },
    {
      icon: Zap,
      title: "E-Tiket Instan",
      description:
        "Tidak perlu repot mencetak tiket fisik. Dapatkan e-tiket digital lengkap dengan QR Code langsung di kotak masuk email Anda setelah pembayaran.",
      gradient: "from-orange-500/10 to-yellow-500/10",
    },
    {
      icon: Smartphone,
      title: "Akses Fleksibel",
      description:
        "Antarmuka responsif yang sangat mudah digunakan. Pesan kursi terbaik Anda kapan saja dan di mana saja, melalui HP maupun Laptop.",
      gradient: "from-orange-500/10 to-purple-500/10",
    },
  ];

  return (
    <section className="relative z-0 bg-zinc-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center">
          <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-orange-500">
            Kenapa LTC Indonesia?
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Platform Pemesanan Tiket Teater{" "}
            <span className="text-orange-500">Modern & Terpercaya</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
            Kami menghadirkan kemudahan teknologi untuk memastikan pengalaman
            menonton teater Anda lancar, dari pemesanan hingga pertunjukan.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                {/* Decorative Gradient Blob */}
                <div
                  className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br ${feature.gradient} opacity-50 blur-2xl transition-opacity group-hover:opacity-70`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition-all group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 text-xl font-bold text-zinc-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 leading-relaxed text-zinc-600">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-orange-600 to-orange-400 transition-all duration-300 group-hover:w-full"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
