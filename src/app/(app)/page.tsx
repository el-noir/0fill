import { MarketingHome } from "@/components/MarketingHome";
import { Footer } from "@/components/Footer";

export default function AppPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f8f5] text-slate-950 selection:bg-emerald-500 selection:text-white">
      <main id="main-content">
        <MarketingHome />
      </main>

      <Footer />
    </div>
  );
}
