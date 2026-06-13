import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katalog LTC Indonesia",
  description:
    "Temukan tiket pertunjukan teater dan event pilihan dari LTC Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('ltc-theme') || 'system';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} flex min-h-full flex-col bg-white font-sans antialiased overflow-x-hidden`}
        style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
      >
        <ThemeProvider>
          <LayoutWrapper>
            <main className="flex-1">{children}</main>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
