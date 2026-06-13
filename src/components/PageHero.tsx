import { ReactNode } from "react";

interface PageHeroProps {
  /** Opsional: Icon bulat di atas judul (ReactNode) */
  icon?: ReactNode;
  /** Opsional: Badge/label kecil di atas judul (misal "Official Ticketing Partner") */
  badge?: ReactNode;
  /** Judul utama halaman (bisa JSX untuk bagian berwarna) */
  title: ReactNode;
  /** Deskripsi singkat di bawah judul */
  description?: ReactNode;
  /** Opsional: Konten tambahan di bawah deskripsi (misal tombol CTA) */
  children?: ReactNode;
  /** Lebar maksimum konten teks, default "2xl" */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl";
  /** Padding bawah ekstra (untuk hero yang tinggi), default "normal" */
  size?: "normal" | "large";
}

const MAX_WIDTH_MAP: Record<NonNullable<PageHeroProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export default function PageHero({
  icon,
  badge,
  title,
  description,
  children,
  maxWidth = "2xl",
  size = "normal",
}: PageHeroProps) {
  const paddingBottom = size === "large"
    ? "pb-28 lg:pb-32"
    : "pb-16 lg:pb-20";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-b-[40px] bg-linear-to-br from-orange-50 via-white to-orange-100 pt-24 shadow-lg lg:rounded-b-[60px] ${paddingBottom} ${size === "large" ? "mb-16" : ""}`}
    >
      {/* Decorative Blobs */}
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl" />

      {/* Content */}
      <div
        className={`relative z-10 mx-auto px-4 text-center ${MAX_WIDTH_MAP[maxWidth]}`}
      >
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Icon (opsional) */}
          {icon && (
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-orange-100 p-4">{icon}</div>
            </div>
          )}

          {/* Badge (opsional) */}
          {badge && (
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100 px-4 py-1.5 text-sm font-bold text-orange-500 shadow-sm">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 md:text-5xl">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg leading-relaxed text-zinc-600">
              {description}
            </p>
          )}

          {/* Children (CTA Buttons, dll) */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </div>
  );
}
