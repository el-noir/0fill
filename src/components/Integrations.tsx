import { ArrowRight, Braces, Mail, PlugZap, ShieldCheck, Webhook } from 'lucide-react';

const integrations = [
  {
    name: 'Google Forms',
    desc: 'Import existing forms and preview the AI conversation.',
    icon: Braces,
  },
  {
    name: 'Gmail',
    desc: 'Send recovery emails through Google OAuth.',
    icon: Mail,
  },
  {
    name: 'Webhooks',
    desc: 'Send signed events to your endpoint.',
    icon: Webhook,
  },
  {
    name: 'Zapier, Make, n8n',
    desc: 'Use catch hooks for automation workflows.',
    icon: PlugZap,
  },
  {
    name: 'Custom API',
    desc: 'Verify payload signatures on your backend.',
    icon: ShieldCheck,
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="bg-white py-24" aria-labelledby="integrations-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Integrations
          </p>
          <h2 id="integrations-title" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Google where it matters. Webhooks for everything else.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Keep the integration model simple: import from Google Forms, recover with Gmail,
            and route events to the systems your team already trusts.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {integrations.map((item, index) => (
            <article key={item.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <item.icon className="h-4 w-4" />
                </div>
                {index < integrations.length - 1 && <ArrowRight className="hidden h-4 w-4 text-slate-300 lg:block" />}
              </div>
              <h3 className="text-base font-semibold text-slate-950">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
