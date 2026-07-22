import { Activity, Mail, MessageSquare, Webhook } from 'lucide-react';

const stats = [
  {
    icon: MessageSquare,
    value: 'Partial capture',
    label: 'Save answers before final submit, including abandoned conversations.',
  },
  {
    icon: Mail,
    value: 'Gmail recovery',
    label: 'Send follow-ups from a connected Google mailbox with resume links.',
  },
  {
    icon: Webhook,
    value: 'Signed webhooks',
    label: 'Route completed, abandoned, recovered, and failed events.',
  },
  {
    icon: Activity,
    value: 'Delivery logs',
    label: 'See queued, sent, failed, retried, skipped, and opted-out activity.',
  },
];

export function Stats() {
  return (
    <section className="bg-[#f7f8f5] py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={value} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-base font-semibold tracking-tight text-slate-950">{value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
