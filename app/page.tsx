import { HeroSection } from "./components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <main className="flex-1" />
    </div>
  );
}
