'use client';

import { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  ClipboardList,
  Mail,
  MessageSquare,
  Target,
  Webhook,
  Zap,
} from 'lucide-react';

const marketingVars = {
  '--m-bg': 'oklch(0.985 0.003 95)',
  '--m-fg': 'oklch(0.20 0.008 250)',
  '--m-surface': 'oklch(0.995 0.002 95)',
  '--m-surface-2': 'oklch(0.97 0.004 95)',
  '--m-card': 'oklch(1 0 0)',
  '--m-primary': 'oklch(0.58 0.14 158)',
  '--m-primary-soft': 'oklch(0.955 0.035 158)',
  '--m-border': 'oklch(0.905 0.005 95)',
  '--m-border-strong': 'oklch(0.82 0.006 95)',
  '--m-ink': 'oklch(0.19 0.008 250)',
  '--m-ink-2': 'oklch(0.245 0.01 250)',
} as CSSProperties;

const cardShadow = 'shadow-[0_1px_2px_rgb(15_23_20/0.04),0_8px_24px_-12px_rgb(15_23_20/0.08)]';
const liftShadow = 'shadow-[0_12px_44px_-14px_rgb(15_23_20/0.18),0_2px_6px_rgb(15_23_20/0.05)]';
const revealEase = [0.16, 1, 0.3, 1] as const;

const useCases = [
  {
    icon: Target,
    title: 'Lead generation agencies',
    context: 'Paid traffic, client forms, multi-account routing.',
    problem: 'A visitor starts a high-intent form, gives useful context, then leaves before the final submit event.',
    workflow: '0Fill captures partial answers, sends recovery from the connected mailbox, and pushes abandoned or recovered events into the right client workflow.',
    routes: ['Client webhook', 'Gmail follow-up', 'Recovery status'],
  },
  {
    icon: BriefcaseBusiness,
    title: 'SaaS demo requests',
    context: 'Demo qualification, sales handoff, buyer intent.',
    problem: 'Static forms either ask too little or become long enough that buyers drop before qualification is complete.',
    workflow: 'The conversation collects one answer at a time, adapts around context, and preserves enough signal for sales even when the lead pauses.',
    routes: ['Qualified lead', 'Partial intent', 'Sales notes'],
  },
  {
    icon: ClipboardList,
    title: 'Recruiting and applications',
    context: 'Candidate intake, resume uploads, longer flows.',
    problem: 'Candidates often need time to gather details, and traditional application forms lose the work already completed.',
    workflow: 'Applicants can progress through a guided intake, leave with answers saved, and return through a recovery link without restarting.',
    routes: ['Candidate record', 'Resume field', 'Resume link'],
  },
  {
    icon: CalendarCheck,
    title: 'Service consultations',
    context: 'Quote requests, bookings, consultations.',
    problem: 'Prospects need to explain nuance, urgency, and constraints, but a rigid form makes the request feel harder than the service.',
    workflow: '0Fill turns the intake into a simple conversation and routes useful context before your team follows up.',
    routes: ['Consult request', 'Urgency signal', 'Webhook event'],
  },
];

const sharedWorkflow = [
  {
    icon: MessageSquare,
    title: 'Capture',
    body: 'Turn the existing form into a guided conversation and save progress as the visitor answers.',
  },
  {
    icon: Mail,
    title: 'Recover',
    body: 'Follow up from Google SMTP with a resume link when a useful session goes quiet.',
  },
  {
    icon: Webhook,
    title: 'Route',
    body: 'Send completed, abandoned, recovered, and failed events to external tools.',
  },
];

function Eyebrow({ children, tone = 'primary' }: { children: ReactNode; tone?: 'primary' | 'ink' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.14em] ${
        tone === 'ink' ? 'text-emerald-300' : 'text-[var(--m-primary)]'
      }`}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {children}
    </div>
  );
}

function MarketingButton({
  children,
  href,
  variant = 'primary',
}: {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'ink';
}) {
  const variants = {
    primary: 'bg-[var(--m-primary)] text-white hover:brightness-95',
    secondary: 'border border-[var(--m-border-strong)] bg-[var(--m-surface)] text-[var(--m-fg)] hover:bg-[var(--m-surface-2)]',
    ink: 'bg-[var(--m-ink)] text-white hover:bg-[var(--m-ink-2)]',
  };

  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-[6px] px-[18px] text-sm font-medium transition-all duration-200 ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}

function LifecyclePanel() {
  return (
    <motion.div
      className={`rounded-[8px] border border-slate-800 bg-[var(--m-ink)] p-4 text-white ${liftShadow}`}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: revealEase }}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[12px] font-medium text-white/45">Lead lifecycle</p>
          <p className="mt-1 text-[16px] font-semibold">Abandoned demo request</p>
        </div>
        <span className="rounded-[6px] border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-100">
          Recovering
        </span>
      </div>

      <div className="relative mt-5 space-y-3">
        {[
          { icon: MessageSquare, label: 'Conversation started', meta: 'Email and company captured', tone: 'success' },
          { icon: Zap, label: 'Partial response saved', meta: 'Primary interest answered', tone: 'success' },
          { icon: Mail, label: 'Gmail recovery queued', meta: 'Resume link ready', tone: 'warn' },
          { icon: Webhook, label: 'Event route prepared', meta: 'Client endpoint selected', tone: 'muted' },
        ].map((event, index) => (
          <motion.div
            key={event.label}
            className="flex gap-3 rounded-[8px] border border-white/10 bg-white/[0.06] p-3"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.42 + index * 0.12, ease: revealEase }}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] ${
                event.tone === 'success'
                  ? 'bg-emerald-300 text-slate-950'
                  : event.tone === 'warn'
                    ? 'bg-amber-300 text-slate-950'
                    : 'bg-white/10 text-white'
              }`}
            >
              <event.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white">{event.label}</p>
              <p className="mt-0.5 text-[12px] leading-5 text-white/45">{event.meta}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function CaseStudiesPage() {
  return (
    <main style={marketingVars} className="min-h-screen bg-[var(--m-bg)] text-[var(--m-fg)]">
      <section className="relative overflow-hidden border-b border-[var(--m-border)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(15_23_20/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(15_23_20/0.045)_1px,transparent_1px)] bg-[size:56px_56px] opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_14%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-6 py-20 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)] lg:py-24">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: revealEase }}
          >
            <Eyebrow>Use cases</Eyebrow>
            <h1 className="mt-5 text-balance text-[42px] font-semibold leading-[1.03] md:text-[64px]">
              Operational playbooks for recovering form intent.
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-slate-600">
              0Fill is most useful anywhere a form starts a business process: agency lead capture,
              demo requests, recruiting intake, service consultations, and any workflow where an unfinished response still matters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MarketingButton href="/start-free">
                Start with a form
                <ArrowRight className="h-4 w-4" />
              </MarketingButton>
              <MarketingButton href="/#how-it-works" variant="secondary">
                See workflow
              </MarketingButton>
            </div>
          </motion.div>

          <LifecyclePanel />
        </div>
      </section>

      <section className="border-b border-[var(--m-border)]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 lg:py-24">
          <motion.div
            className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: revealEase }}
          >
            <div>
              <Eyebrow>Buyer segments</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-[34px] font-semibold leading-[1.08] md:text-[48px]">
                Built around the moment people leave.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-7 text-slate-600">
              Each use case follows the same product philosophy: preserve intent, make recovery feel natural,
              and send useful events to the tools teams already operate.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            {useCases.map((useCase, index) => (
              <motion.article
                key={useCase.title}
                className={`group rounded-[8px] border border-[var(--m-border)] bg-[var(--m-card)] p-6 transition-all hover:border-[var(--m-border-strong)] ${cardShadow}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: revealEase }}
                whileHover={{ y: -4 }}
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-emerald-50 text-[var(--m-primary)]">
                    <useCase.icon className="h-[18px] w-[18px]" />
                  </div>
                  <span className="rounded-[6px] border border-[var(--m-border)] bg-[var(--m-surface-2)] px-2.5 py-1 text-[11px] font-medium text-slate-500">
                    {useCase.context}
                  </span>
                </div>

                <h3 className="text-[21px] font-semibold text-[var(--m-fg)]">{useCase.title}</h3>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Problem</p>
                    <p className="mt-2 text-[14px] leading-7 text-slate-600">{useCase.problem}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--m-primary)]">0Fill workflow</p>
                    <p className="mt-2 text-[14px] leading-7 text-slate-700">{useCase.workflow}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {useCase.routes.map((route) => (
                    <span key={route} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--m-border)] bg-[var(--m-surface-2)] px-2.5 py-1 text-[12px] font-medium text-slate-600">
                      <Check className="h-3.5 w-3.5 text-[var(--m-primary)]" />
                      {route}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[var(--m-ink)] text-white">
        <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: revealEase }}
            >
              <Eyebrow tone="ink">Shared foundation</Eyebrow>
              <h2 className="mt-5 text-[36px] font-semibold leading-[1.05] md:text-[52px]">
                Same engine, different workflows.
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-8 text-white/60">
                Use cases change. The recovery mechanics stay consistent enough for teams to trust.
              </p>
            </motion.div>

            <div className="relative grid gap-3 md:grid-cols-3">
              <motion.div
                className="pointer-events-none absolute left-4 right-4 top-10 hidden h-px bg-emerald-300/20 md:block"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.1, ease: 'linear' }}
              />
              {sharedWorkflow.map((step, index) => (
                <motion.article
                  key={step.title}
                  className="relative rounded-[8px] border border-white/10 bg-white/[0.06] p-5"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: index * 0.12, ease: revealEase }}
                  whileHover={{ y: -4 }}
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-emerald-300 text-slate-950">
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-[12px] text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="text-[18px] font-semibold">{step.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-white/55">{step.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-8">
        <motion.div
          className={`mx-auto flex max-w-[1240px] flex-col justify-between gap-8 rounded-[8px] border border-[var(--m-border)] bg-[var(--m-card)] p-8 md:flex-row md:items-center md:p-10 ${cardShadow}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: revealEase }}
        >
          <div>
            <Eyebrow>Preview</Eyebrow>
            <h2 className="mt-4 text-[30px] font-semibold leading-tight md:text-[40px]">Try the workflow on a real form.</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600">
              Start with a Google Form, inspect the respondent experience, then save it when the recovery path is ready.
            </p>
          </div>
          <MarketingButton href="/start-free" variant="ink">
            Start with a form
            <ArrowRight className="h-4 w-4" />
          </MarketingButton>
        </motion.div>
      </section>
    </main>
  );
}
