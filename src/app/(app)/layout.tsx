"use client";

import { Navbar } from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8f5] text-slate-950">
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}
