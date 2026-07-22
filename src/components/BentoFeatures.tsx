import {
  BarChart3,
  Bot,
  FileInput,
  Mail,
  MessageSquareMore,
  ShieldCheck,
  Webhook,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquareMore,
    title: 'Conversational form experience',
    desc: 'Ask one question at a time, preserve context, and make longer forms feel lighter.',
  },
  {
    icon: FileInput,
    title: 'Partial response capture',
    desc: 'Store usable lead data before someone reaches the final submit button.',
  },
  {
    icon: Mail,
    title: 'Gmail recovery campaigns',
    desc: 'Send follow-up emails with resume links from the connected organization mailbox.',
  },
  {
    icon: Webhook,
    title: 'Webhook delivery',
    desc: 'Send signed events for completed, abandoned, recovered, and failed submissions.',
  },
  {
    icon: BarChart3,
    title: 'Analytics and summaries',
    desc: 'Review response trends, drop-off signals, and AI-generated submission summaries.',
  },
  {
    icon: ShieldCheck,
    title: 'Delivery visibility',
    desc: 'Track retry attempts, failures, skips, opt-outs, and campaign health.',
  },
  {
    icon: Bot,
    title: 'Website embed',
    desc: 'Install the chat widget on approved domains with a small script snippet.',
  },
];

export function BentoFeatures() {
  return (
    <section id="features" className="bg-[#f7f8f5] py-24" aria-labelledby="features-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Product
          </p>
          <h2 id="features-title" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            The form stack for capture, recovery, and routing.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            0Fill is not just a prettier form. It gives teams a public chat experience
            and the operational controls needed after someone abandons it.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
