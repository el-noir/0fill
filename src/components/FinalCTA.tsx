import Link from 'next/link';
import { ArrowRight, Mail, Webhook } from 'lucide-react';

export function FinalCTA() {
  return (
    <section id="waitlist" className="bg-[#f7f8f5] px-6 py-24" aria-labelledby="cta-title">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-xl bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-12">
        <div className="mb-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <Mail className="h-3.5 w-3.5" />
            Gmail recovery
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
            <Webhook className="h-3.5 w-3.5" />
            Signed webhooks
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 id="cta-title" className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              Paste a form URL. See what 0Fill can recover.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Start with an existing form, preview the conversation, then publish it
              when your recovery and webhook workflow is ready.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              href="/start-free"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Start with a form
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#recovery"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View recovery flow
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
