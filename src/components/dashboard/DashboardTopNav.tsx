"use client";

import { Search, Bell, User, LogOut, Settings as SettingsIcon, Shield, Menu, LayoutDashboard, FormInput, Inbox, Blocks, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { usePathname, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { logoutUser, fetchUserProfile } from "@/lib/api/auth";
import { useEffect } from "react";
import { OrganizationSwitcher } from "@/components/dashboard/OrganizationSwitcher";
import { DashboardThemeToggle } from "@/components/dashboard/DashboardThemeToggle";

import Image from "next/image";

function MobileSidebarLinks() {
    const pathname = usePathname();
    const params = useParams();
    const orgId = params.orgId as string;

    const links = [
        { name: "Overview", href: `/dashboard/${orgId}`, icon: LayoutDashboard },
        { name: "Forms", href: `/dashboard/${orgId}/forms`, icon: FormInput },
        { name: "Submissions", href: `/dashboard/${orgId}/submissions`, icon: Inbox },
        { name: "Integrations", href: `/dashboard/${orgId}/integrations`, icon: Blocks },
        { name: "Settings", href: `/dashboard/${orgId}/settings`, icon: Settings },
    ];

    return (
        <nav className="py-6 px-4 space-y-1">
            {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ${isActive
                            ? "bg-[var(--dash-elevated)] text-[var(--dash-text)] font-medium border border-[var(--dash-border)]"
                            : "text-[var(--dash-muted)] hover:text-[var(--dash-text)] active:bg-[var(--dash-hover)]"
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

export function DashboardTopNav() {
    const { user } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        fetchUserProfile().catch(console.error);
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        router.push('/sign-in');
    };

    return (
        <header className="h-16 bg-[var(--dash-bg)] border-b border-[var(--dash-border)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <div className="md:hidden flex items-center mr-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-2 -ml-2 text-[var(--dash-muted)] hover:text-[var(--dash-text)] transition-colors focus:outline-none">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="dashboard-theme w-[280px] sm:w-[320px] bg-[var(--dash-bg)] border-r border-[var(--dash-border)] p-0 flex flex-col h-full">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">
                                Access dashboard pages and settings for your organization.
                            </SheetDescription>
                            <div className="h-16 flex items-center px-6 border-b border-[var(--dash-border)] shrink-0">
                                <Link href="/" className="text-[var(--dash-text)] font-semibold flex items-center gap-2.5 tracking-tight">
                                    <div className="relative w-6 h-6 rounded-md overflow-hidden group-hover:scale-110 transition-transform shrink-0">
                                        <Image
                                            src="/logo.png"
                                            alt="0Fill Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    0Fill
                                </Link>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <MobileSidebarLinks />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="flex items-center text-sm font-medium">
                    <OrganizationSwitcher />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Flat Search Input */}
                <div className="hidden lg:flex items-center relative group">
                    <Search className="w-3.5 h-3.5 text-[var(--dash-subtle)] absolute left-2.5" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-[var(--dash-panel)] border border-[var(--dash-border)] hover:border-[var(--dash-strong-border)] text-[var(--dash-text)] text-sm rounded-md pl-8 pr-10 py-1.5 focus:outline-none focus:border-brand-purple transition-colors w-56 placeholder:text-[var(--dash-subtle)] focus:bg-[var(--dash-card)]"
                    />
                    <div className="absolute right-2 px-1 text-[10px] font-medium text-[var(--dash-subtle)] border border-[var(--dash-border)] rounded bg-[var(--dash-elevated)]">
                        ⌘K
                    </div>
                </div>

                <div className="h-4 w-px bg-[var(--dash-border)] mx-1 hidden sm:block"></div>

                <DashboardThemeToggle />

                <button className="p-1.5 text-[var(--dash-muted)] hover:text-[var(--dash-text)] transition-colors rounded-md hover:bg-[var(--dash-hover)]">
                    <Bell className="w-4 h-4" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 outline-none">
                            <div className="w-8 h-8 rounded-sm bg-[var(--dash-elevated)] border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text)] font-medium text-xs hover:border-[var(--dash-strong-border)] transition-colors">
                                {user?.firstName?.[0] || <User className="w-3.5 h-3.5 text-[var(--dash-subtle)]" />}
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[var(--dash-panel)] border-[var(--dash-border)] text-[var(--dash-text)]">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium text-[var(--dash-text)]">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-[var(--dash-subtle)] truncate">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-[var(--dash-border)]" />
                        <DropdownMenuItem
                            onClick={() => router.push('/dashboard/settings')}
                            className="flex items-center gap-2 focus:bg-[var(--dash-hover)] focus:text-[var(--dash-text)] cursor-pointer"
                        >
                            <SettingsIcon className="w-4 h-4 text-[var(--dash-subtle)]" />
                            <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 focus:bg-[var(--dash-hover)] focus:text-[var(--dash-text)] cursor-pointer">
                            <Shield className="w-4 h-4 text-[var(--dash-subtle)]" />
                            <span>Security</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[var(--dash-border)]" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
