interface AdminHeroSectionProps {
  title: string;
  description?: string;
}

export default function AdminHeroSection({
  title,
  description,
}: AdminHeroSectionProps) {
  return (
    <div className="relative mb-8 w-full overflow-hidden rounded-b-[40px] bg-linear-to-br from-orange-50 via-white to-orange-100 pb-16 pt-12 shadow-lg lg:rounded-b-[60px] lg:pb-20 lg:pt-16">
      {/* Decorative Blobs */}
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4 text-center md:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">
          <span className="text-orange-500">{title}</span>
        </h1>
        {description && (
          <p className="mt-3 text-base text-zinc-600 md:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
