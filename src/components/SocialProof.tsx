import { BriefcaseBusiness, Headphones, Megaphone, Users } from 'lucide-react';

const segments = [
  {
    icon: Megaphone,
    title: 'Lead generation agencies',
    text: 'Recover paid traffic that starts a form but leaves before submitting.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'SaaS sales teams',
    text: 'Qualify demo requests with richer context before routing to sales ops.',
  },
  {
    icon: Users,
    title: 'Recruiting teams',
    text: 'Make applications feel conversational while preserving structured answers.',
  },
  {
    icon: Headphones,
    title: 'Service businesses',
    text: 'Collect quote, booking, and intake details without losing mid-form intent.',
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-slate-200 bg-white py-16" aria-label="Who ZeroFill helps">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Designed for high-intent forms
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Useful when a dropped answer still matters.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            0Fill is strongest on forms tied to pipeline, hiring, service requests,
            or any workflow where partial intent should not disappear.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 md:grid-cols-2 xl:grid-cols-4">
          {segments.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-white p-5">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
