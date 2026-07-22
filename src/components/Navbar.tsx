'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useOrgStore } from '@/stores/orgStore';
import { logoutUser } from '@/lib/api/auth';

const publicNavItems = [
  { name: 'Product', href: '#features' },
  { name: 'Workflow', href: '#how-it-works' },
  { name: 'Recovery', href: '#recovery' },
  { name: 'Integrations', href: '#integrations' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useAuthStore();
  const { currentOrgId } = useOrgStore();
  const pathname = usePathname();

  const authNavItems = [
    { name: 'Dashboard', href: `/dashboard/${currentOrgId || ''}` },
    { name: 'Forms', href: `/dashboard/${currentOrgId || ''}/forms` },
    { name: 'Integrations', href: `/dashboard/${currentOrgId || ''}/integrations` },
  ];

  const items = isAuthenticated && !isLoading ? authNavItems : publicNavItems;

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await logoutUser();
    } catch {
      /* auth state clears in the API layer */
    }
    window.location.href = '/';
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 w-full px-4 py-4">
      <div className="mx-auto max-w-7xl" ref={dropdownRef}>
        <nav
          className={`flex h-14 items-center justify-between rounded-xl border px-4 transition-all ${
            scrolled
              ? 'border-slate-200 bg-white/90 shadow-lg shadow-slate-950/5 backdrop-blur-xl'
              : 'border-white/70 bg-white/75 shadow-sm backdrop-blur-xl'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-100">
            <span className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image src="/logo.png" alt="0Fill Logo" fill className="object-cover" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-950">0Fill</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && !isLoading ? (
              <>
                <span className="max-w-[140px] truncate text-sm font-medium text-slate-600">
                  {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="px-2 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
                  Sign in
                </Link>
                <Link href="/start-free" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Start free
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setDropdownOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:text-slate-950 md:hidden"
            aria-label="Open menu"
            aria-expanded={dropdownOpen}
          >
            {dropdownOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 md:hidden"
            >
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setDropdownOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
                {isAuthenticated && !isLoading ? (
                  <>
                    <Link
                      href={`/dashboard/${currentOrgId || ''}`}
                      onClick={() => setDropdownOpen(false)}
                      className="rounded-lg bg-slate-950 px-3 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setDropdownOpen(false)}
                      className="rounded-lg border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold text-slate-700"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/start-free"
                      onClick={() => setDropdownOpen(false)}
                      className="rounded-lg bg-slate-950 px-3 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Start free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
