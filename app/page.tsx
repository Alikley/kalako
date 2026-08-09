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
              {"\u0645\u062d\u0635\u0648\u0644\u0627\u062a \u06a9\u0627\u0644\u0627\u06a9\u0648"}
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <ProductCards />
            <FilterSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
