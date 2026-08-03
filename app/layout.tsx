import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "./components/Navbar";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "کالاکو | جستجوی هوشمند لباس",
  description:
    "کالاکو - بهترین قیمت بازار لباس. جستجوی هوشمند در کانال‌های تلگرام با فیلترهای پیشرفته.",
  keywords: [
    "کالاکو",
    "kalako",
    "جستجوی لباس",
    "تیشرت",
    "شلوار",
    "کتونی",
    "کفش",
    "لباس مردانه",
    "لباس زنانه",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className="antialiased bg-kalako-cream text-kalako-navy">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
