import { HeroSection } from "./components/HeroSection";
import { FilterSidebar } from "./components/FilterSidebar";
import { ProductCards } from "./components/ProductCards";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-kalako-navy">
              محصولات کالاکو
            </h2>
          </div>
          {/*
            v1.0.0.9: سایدبار فیلتر در DOM قبل از محصولات قرار گرفت تا در موبایل
            بالای لیست دیده شود (قبلاً زیر محصولات بود و عملاً پنهان بود)؛
            با کلاس‌های order جایگاه دسکتاپ دقیقاً مثل قبل مانده است
            (محصولات راست، فیلتر چپ — چیدمان RTL).
          */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:order-2 w-full lg:w-auto">
              <FilterSidebar />
            </div>
            <div className="lg:order-1 flex-1 min-w-0">
              <ProductCards />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
