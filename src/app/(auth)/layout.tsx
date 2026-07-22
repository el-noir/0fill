import type React from "react";
import {Navbar} from "@/components/Navbar";

export default function AuthLayout({children}: {
  children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-[#f7f8f5]">
            <Navbar />
            <div className="pt-20">
              {children}
            </div>
        </div>
    );
}
