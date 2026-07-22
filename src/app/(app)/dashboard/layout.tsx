"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardThemeProvider } from "@/components/dashboard/DashboardThemeProvider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading } = useRequireAuth();

    if (isLoading) {
        return (
            <DashboardThemeProvider>
                <div className="dashboard-theme min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text)] flex items-center justify-center overflow-hidden">
                    <div className="flex flex-col items-center">
                        <div className="relative w-8 h-8 mb-6">
                            <div className="absolute inset-0 border-2 border-[var(--dash-border)] rounded-full"></div>
                            <div className="absolute inset-0 border-t-2 border-brand-purple rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            </DashboardThemeProvider>
        );
    }

    return (
        <DashboardThemeProvider>
            <div className="dashboard-theme h-screen bg-[var(--dash-bg)] text-[var(--dash-text)] flex overflow-hidden">
                <DashboardSidebar />

                <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
                    <DashboardTopNav />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </DashboardThemeProvider>
    );
}
