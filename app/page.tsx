import { HeroSection } from "./components/banner/HeroSection";
import { FilterSidebar } from "./components/card/FilterSidebar";
import { ProductCards } from "./components/card/ProductCards";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      {/* Products Section: Sidebar (left visually) + Cards */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Section Header - full width above sidebar and cards */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-kalako-navy">
              {
                "\u06f9\u06f4\u06f6 \u0645\u062d\u0635\u0648\u0644 \u0628\u0631\u0627\u06cc \u0634\u0645\u0627"
              }
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cards first in DOM so they appear on the RIGHT in RTL */}
            <ProductCards />
            {/* Sidebar appears on the LEFT in RTL */}
            <FilterSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
