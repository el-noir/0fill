"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, FormInput, Inbox, Blocks, Settings, CreditCard } from "lucide-react";
import { Suspense } from "react";
import Image from "next/image";
import { useOrgStore } from "@/stores/orgStore";

function SidebarLinks() {
    const pathname = usePathname();
    const params = useParams();
    const orgId = params.orgId as string;

    const links = [
        { name: "Overview", href: `/dashboard/${orgId}`, icon: LayoutDashboard },
        { name: "Forms", href: `/dashboard/${orgId}/forms`, icon: FormInput },
        { name: "Submissions", href: `/dashboard/${orgId}/submissions`, icon: Inbox },
        { name: "Integrations", href: `/dashboard/${orgId}/integrations`, icon: Blocks },
        { name: "Billing", href: `/dashboard/${orgId}/billing`, icon: CreditCard },
        { name: "Settings", href: `/dashboard/${orgId}/settings`, icon: Settings },
    ];

    return (
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto overscroll-contain">
            {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${isActive
                            ? "bg-[var(--dash-elevated)] text-[var(--dash-text)] font-medium border border-[var(--dash-border)]"
                            : "text-[var(--dash-muted)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-hover)]"
                            }`}
                    >
                        <Icon className={`w-4 h-4 shrink-0 col-span-1 ${isActive ? "text-brand-purple" : "text-[var(--dash-subtle)]"}`} />
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}

export function DashboardSidebar() {
    const params = useParams();
    const orgId = params.orgId as string;
    const { getCurrentOrg } = useOrgStore();
    const currentOrg = getCurrentOrg();
    
    // We get limits from currentOrg. (Assuming standard = 10 forms).
    const planName = currentOrg?.plan === 'pro' ? 'Pro Plan' : currentOrg?.plan === 'enterprise' ? 'Business Plan' : 'Starter Plan';
    const isStarter = !currentOrg?.plan || currentOrg?.plan === 'standard';

    return (
        <aside className="w-64 flex-shrink-0 bg-[var(--dash-bg)] border-r border-[var(--dash-border)] hidden md:flex flex-col h-full">
            <div className="h-16 flex items-center px-6 border-b border-[var(--dash-border)] shrink-0">
                <Link href="/" className="text-[var(--dash-text)] font-semibold flex items-center gap-2.5 tracking-tight group">
                    <div className="relative w-6 h-6 rounded-md overflow-hidden group-hover:scale-110 transition-transform shrink-0">
                        <Image
                            src="/logo.png"
                            alt="ZeroFill Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    ZeroFill
                </Link>
            </div>

            <Suspense fallback={<nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto overscroll-contain" />}>
                <SidebarLinks />
            </Suspense>

            <div className="p-4 border-t border-[var(--dash-border)] shrink-0">
                <div className="bg-[var(--dash-panel)] rounded-md p-4 text-sm border border-[var(--dash-border)]">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[var(--dash-text)] font-medium text-xs">
                            {currentOrg?.formCount ?? 0} / {currentOrg?.limits?.maxForms ?? 10} Forms
                        </h4>
                        {isStarter && (
                            <Link href={`/dashboard/${orgId || ''}/billing`} className="text-brand-purple hover:text-[var(--dash-text)] transition-colors text-[10px] uppercase font-semibold">
                                Upgrade
                            </Link>
                        )}
                    </div>
                    <div className="w-full bg-[var(--dash-elevated)] rounded-sm h-1 mt-2">
                        <div 
                            className="bg-brand-purple h-full rounded-sm transition-all duration-500" 
                            style={{ width: `${Math.min(100, ((currentOrg?.formCount ?? 0) / (currentOrg?.limits?.maxForms ?? 10)) * 100)}%` }} 
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
}
