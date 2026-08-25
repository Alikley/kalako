import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SessionProvider } from "./components/SessionProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

/**
 * v1.0.0.7: متادیتای سایت
 *  - عنوان دیفالت: فقط اسم سایت → «کالاکو»
 *  - عنوان داینامیک هنگام سرچ / صفحات مختلف از طریق هوک useDocumentTitle
 *  - آیکون‌ها (favicon و apple-icon) با file convention های Next.js:
 *    app/icon.svg + app/favicon.ico + app/apple-icon.png (لوگوی کالاکو)
 */
export const metadata: Metadata = {
  title: "کالاکو",
  description: "جستجو و مقایسه قیمت لباس از کانال‌های فروش تلگرام با هوش مصنوعی",
  applicationName: "کالاکو",
  keywords: [
    "کالاکو",
    "خرید لباس",
    "قیمت لباس",
    "کانال تلگرام",
    "مقایسه قیمت",
    "تخفیف لباس",
    "خرید آنلاین",
  ],
  authors: [{ name: "کالاکو" }],
  openGraph: {
    title: "کالاکو",
    description: "جستجو و مقایسه قیمت لباس از کانال‌های فروش تلگرام",
    type: "website",
    locale: "fa_IR",
    siteName: "کالاکو",
  },
  twitter: {
    card: "summary",
    title: "کالاکو",
    description: "جستجو و مقایسه قیمت لباس از کانال‌های فروش تلگرام",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="antialiased bg-kalako-cream text-kalako-navy">
      <SessionProvider>
        <Navbar />
        {children}
        <Footer />
      </SessionProvider>
      </body>
    </html>
  );
}
