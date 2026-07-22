import Link from 'next/link';
import { ArrowRight, CalendarCheck, ClipboardList, Headphones, Target } from 'lucide-react';

const useCases = [
  {
    icon: Target,
    title: 'Lead qualification',
    desc: 'Ask follow-up questions, save partial intent, and send high-value abandoned leads back into motion.',
  },
  {
    icon: CalendarCheck,
    title: 'Demo and consultation requests',
    desc: 'Collect budget, timeline, company context, and contact details before handoff.',
  },
  {
    icon: ClipboardList,
    title: 'Applications and intake',
    desc: 'Make long forms feel lighter while preserving structured answers for review.',
  },
  {
    icon: Headphones,
    title: 'Support and service inquiries',
    desc: 'Gather the details your team needs and route urgent or incomplete requests.',
  },
];

export function Testimonials() {
  return (
    <section id="use-cases" className="border-t border-slate-200 bg-[#f7f8f5] py-24" aria-labelledby="use-cases-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Use cases
            </p>
            <h2 id="use-cases-title" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Built for forms with a real next step.
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-700"
          >
            Explore use cases
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {useCases.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
