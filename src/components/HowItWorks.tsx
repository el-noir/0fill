import { Bot, MailCheck, PanelsTopLeft, Route } from 'lucide-react';

const steps = [
  {
    id: '01',
    icon: PanelsTopLeft,
    title: 'Bring in the form',
    desc: 'Import a Google Form or build a new form inside 0Fill.',
  },
  {
    id: '02',
    icon: Bot,
    title: 'Launch the AI chat',
    desc: 'Publish a public link or embed the conversational form on your site.',
  },
  {
    id: '03',
    icon: MailCheck,
    title: 'Recover drop-offs',
    desc: 'Save partial answers, schedule follow-up, and include a resume link.',
  },
  {
    id: '04',
    icon: Route,
    title: 'Route the event',
    desc: 'Send completed and abandoned lead events to webhooks or automation tools.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 grid gap-8 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Workflow
            </p>
            <h2 id="how-it-works-title" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              From first answer to follow-up.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            The public experience and the operational layer stay connected:
            chat, partial capture, recovery, analytics, and delivery.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.id} className="bg-white p-6">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs text-slate-400">{step.id}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
