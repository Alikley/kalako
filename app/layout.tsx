import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SessionProvider } from "./components/SessionProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "\u06a9\u0627\u0644\u0627\u06a9\u0648 | \u062c\u0633\u062a\u062c\u0648\u06cc \u0647\u0648\u0634\u0645\u0646\u062f \u0644\u0628\u0627\u0633",
  description: "\u06a9\u0627\u0644\u0627\u06a9\u0648 - \u0628\u0647\u062a\u0631\u06cc\u0646 \u0642\u06cc\u0645\u062a \u0628\u0627\u0632\u0627\u0631 \u0644\u0628\u0627\u0633.",
  icons: { icon: "/favicon.ico" },
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
