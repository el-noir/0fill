import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-14 text-slate-500" aria-label="Footer">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="mb-5 inline-flex items-center gap-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-100">
            <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md">
              <Image src="/logo.png" alt="0Fill Logo" fill className="object-contain" />
            </span>
            <span className="font-semibold text-slate-950">0Fill</span>
          </Link>
          <p className="max-w-sm text-sm leading-6">
            AI conversational forms with partial response capture, recovery follow-up,
            and webhook delivery for teams that cannot afford lost intent.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-950">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#features" className="transition hover:text-slate-950">Features</Link></li>
            <li><Link href="/#recovery" className="transition hover:text-slate-950">Recovery</Link></li>
            <li><Link href="/#integrations" className="transition hover:text-slate-950">Integrations</Link></li>
            <li><Link href="/start-free" className="transition hover:text-slate-950">Start free</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-950">Use Cases</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/case-studies" className="transition hover:text-slate-950">Lead generation</Link></li>
            <li><Link href="/case-studies" className="transition hover:text-slate-950">SaaS demos</Link></li>
            <li><Link href="/case-studies" className="transition hover:text-slate-950">Recruiting</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-950">Trust</h4>
          <ul className="space-y-2 text-sm">
            <li>OAuth Gmail sending</li>
            <li>Signed webhook payloads</li>
            <li>Recovery opt-out controls</li>
            <li>Delivery logs</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-slate-200 px-6 pt-6 text-sm md:flex-row md:items-center">
        <p>Copyright 2026 0Fill. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/sign-in" className="transition hover:text-slate-950">Sign in</Link>
          <Link href="/sign-up" className="transition hover:text-slate-950">Create account</Link>
        </div>
      </div>
    </footer>
  );
}
