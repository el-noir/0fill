'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock,
  Code2,
  GraduationCap,
  Loader2,
  Mail,
  MessageSquare,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Webhook,
  Wrench,
  Zap,
  Briefcase,
} from 'lucide-react';
import { startChat } from '@/lib/api/chat';

type ChipTone = 'neutral' | 'success' | 'warn' | 'ink';

const marketingVars = {
  '--m-bg': 'oklch(0.985 0.003 95)',
  '--m-fg': 'oklch(0.20 0.008 250)',
  '--m-surface': 'oklch(0.995 0.002 95)',
  '--m-surface-2': 'oklch(0.97 0.004 95)',
  '--m-card': 'oklch(1 0 0)',
  '--m-primary': 'oklch(0.58 0.14 158)',
  '--m-primary-soft': 'oklch(0.955 0.035 158)',
  '--m-primary-ink': 'oklch(0.72 0.16 158)',
  '--m-warn': 'oklch(0.72 0.14 75)',
  '--m-warn-soft': 'oklch(0.965 0.045 85)',
  '--m-warn-ink': 'oklch(0.5 0.14 75)',
  '--m-border': 'oklch(0.905 0.005 95)',
  '--m-border-strong': 'oklch(0.82 0.006 95)',
  '--m-ink': 'oklch(0.19 0.008 250)',
  '--m-ink-2': 'oklch(0.245 0.01 250)',
} as CSSProperties;

const cardShadow = 'shadow-[0_1px_2px_rgb(15_23_20/0.04),0_8px_24px_-12px_rgb(15_23_20/0.08)]';
const liftShadow = 'shadow-[0_12px_44px_-14px_rgb(15_23_20/0.18),0_2px_6px_rgb(15_23_20/0.05)]';

function getApiErrorMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const response = 'response' in error ? error.response : undefined;
  if (typeof response !== 'object' || response === null) return undefined;
  const data = 'data' in response ? response.data : undefined;
  if (typeof data !== 'object' || data === null) return undefined;
  const message = 'message' in data ? data.message : undefined;
  return typeof message === 'string' ? message : undefined;
}

function MarketingButton({
  children,
  href,
  variant = 'primary',
  className = '',
}: {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'ink';
  className?: string;
}) {
  const variants = {
    primary:
      'bg-[var(--m-primary)] text-white hover:brightness-95 shadow-[0_1px_0_rgb(255_255_255/0.18)_inset,0_1px_2px_rgb(0_0_0/0.08)]',
    secondary:
      'border border-[var(--m-border-strong)] bg-[var(--m-surface)] text-[var(--m-fg)] hover:bg-[var(--m-surface-2)]',
    ink: 'bg-[var(--m-ink)] text-white hover:bg-[var(--m-ink-2)]',
  };

  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-[18px] text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

function Chip({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: ChipTone; className?: string }) {
  const tones = {
    neutral: 'border-[var(--m-border)] bg-[var(--m-surface-2)] text-[color-mix(in_oklab,var(--m-fg)_75%,transparent)]',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-800',
    ink: 'border-white/15 bg-white/10 text-white/90',
  };

  return (
    <span className={`inline-flex h-6 items-center gap-1.5 rounded-[6px] border px-2 text-[11.5px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

function Eyebrow({ children, tone = 'primary' }: { children: ReactNode; tone?: 'primary' | 'muted' | 'ink' }) {
  const tones = {
    primary: 'text-[var(--m-primary)]',
    muted: 'text-[color-mix(in_oklab,var(--m-fg)_55%,transparent)]',
    ink: 'text-[var(--m-primary-ink)]',
  };

  return (
    <div className={`inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.14em] ${tones[tone]}`}>
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {children}
    </div>
  );
}

function HeroForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url.trim()) {
      setError('Paste a Google Form URL to preview.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await startChat(url.trim());
      router.push(`/start-free?url=${encodeURIComponent(url.trim())}`);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err) || 'We could not read that form. Check the URL and try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-9 w-full max-w-[300px] sm:max-w-[620px]">
      <div className="flex flex-col gap-2 rounded-[14px] border border-[var(--m-border-strong)] bg-[var(--m-surface)] p-1.5 shadow-[0_18px_50px_-24px_rgb(15_23_20/0.28)] focus-within:border-emerald-400 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setError('');
          }}
          placeholder="https://docs.google.com/forms/d/e/..."
          className="min-w-0 flex-1 rounded-[10px] bg-transparent px-3 py-3 text-[14px] text-[var(--m-fg)] outline-none placeholder:text-slate-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[var(--m-primary)] px-5 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking
            </>
          ) : (
            <>
              Preview a form
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
    </form>
  );
}

function HeroChatFrame() {
  const capturedRows = [
    ['intent', 'onboarding for 40-person team', 'complete'],
    ['team_size', '40', 'complete'],
    ['email', 'sarah@acme.i...', 'partial'],
    ['role', '-', 'empty'],
  ] as const;

  return (
    <div className={`w-full max-w-full overflow-hidden rounded-[14px] border border-[var(--m-border)] bg-[var(--m-card)] ${liftShadow}`}>
      <div className="flex items-center gap-2 border-b border-[var(--m-border)] bg-[var(--m-surface-2)]/70 px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="ml-2 flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-[var(--m-border)] bg-[var(--m-surface)] px-2">
          <ShieldCheck className="h-3 w-3 shrink-0 text-[var(--m-primary)]" />
          <span className="truncate font-mono text-[11px] text-slate-500">forms.0fill.co/acme/demo</span>
        </div>
        <Chip tone="success" className="hidden h-5 px-1.5 text-[10.5px] sm:inline-flex">
          <span className="h-1 w-1 rounded-full bg-[var(--m-primary)]" />
          Live
        </Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="relative space-y-3 border-b border-[var(--m-border)] p-5 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--m-fg)] text-[11px] font-semibold text-white">A</div>
              <div>
                <div className="text-[12.5px] font-medium leading-tight">Acme demo</div>
                <div className="text-[10.5px] text-slate-500">Conversational - 4 steps</div>
              </div>
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <span className="h-1 w-6 rounded-full bg-[var(--m-primary)]" />
              <span className="h-1 w-6 rounded-full bg-[var(--m-primary)]" />
              <span className="h-1 w-6 rounded-full bg-[var(--m-primary)]/40" />
              <span className="h-1 w-6 rounded-full bg-[var(--m-border)]" />
            </div>
          </div>

          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <Sparkles className="h-3.5 w-3.5 text-[var(--m-primary)]" />
            </div>
            <div className="max-w-[85%] break-words rounded-[10px] rounded-tl-[3px] bg-[var(--m-surface-2)] px-3 py-2 text-[13px] text-slate-700">
              Hi. What are you hoping to solve with Acme?
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[85%] break-words rounded-[10px] rounded-tr-[3px] bg-[var(--m-fg)] px-3 py-2 text-[13px] text-white">
              We are a 40-person team and need better onboarding for new hires.
            </div>
          </div>

          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <Sparkles className="h-3.5 w-3.5 text-[var(--m-primary)]" />
            </div>
            <div className="max-w-[85%] break-words rounded-[10px] rounded-tl-[3px] bg-[var(--m-surface-2)] px-3 py-2 text-[13px] text-slate-700">
              Got it. What is your work email so we can send a personalized demo?
            </div>
          </div>

          <div className="pt-1">
            <div className="flex h-11 w-full items-center gap-1 rounded-[10px] border border-[var(--m-border-strong)] bg-[var(--m-surface)] px-3 text-[13px]">
              <span className="min-w-0 truncate text-slate-700">sarah@acme.i</span>
              <span className="h-[15px] w-[1.5px] bg-[var(--m-primary)]" />
              <div className="ml-auto inline-flex h-8 shrink-0 items-center gap-1 rounded-[7px] bg-[var(--m-fg)] px-3 text-[12px] font-medium text-white">
                Send
                <Send className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Powered by 0Fill</span>
              <span className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-[var(--m-primary)]" />
                Autosaving
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 bg-[var(--m-surface-2)]/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Session - capturing</span>
            <Chip tone="warn" className="h-5 px-1.5 text-[10.5px]">at risk</Chip>
          </div>

          <div className="space-y-2 rounded-[10px] border border-[var(--m-border)] bg-[var(--m-card)] p-3">
            {capturedRows.map(([key, value, status]) => (
              <div key={key} className="flex items-center justify-between gap-3 text-[11.5px]">
                <span className="font-mono text-slate-500">{key}</span>
                <div className="flex min-w-0 max-w-[66%] items-center gap-1.5">
                  <span
                    className={`truncate ${
                      status === 'complete'
                        ? 'text-slate-700'
                        : status === 'partial'
                          ? 'text-amber-700'
                          : 'text-slate-400'
                    }`}
                  >
                    {value}
                  </span>
                  {status === 'complete' ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-2.5 w-2.5 text-emerald-700" />
                    </span>
                  ) : status === 'partial' ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50">
                      <span className="h-1 w-1 rounded-full bg-amber-500" />
                    </span>
                  ) : (
                    <span className="h-4 w-4 shrink-0 rounded-full border border-dashed border-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[10px] border border-[var(--m-border)] bg-[var(--m-card)] p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11.5px] font-medium">
                <Clock className="h-3 w-3 text-amber-700" />
                Auto-recovery
              </div>
              <span className="font-mono text-[10.5px] text-slate-500">T+12m</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              If Sarah leaves, a Gmail follow-up is queued with a signed resume link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingWebhookCard() {
  const rows = [
    ['Event', 'Abandoned lead'],
    ['Destination', 'Client CRM'],
    ['Signature', 'Verified'],
    ['Status', 'Delivered'],
  ];

  return (
    <div className={`w-full max-w-[280px] overflow-hidden rounded-[12px] border border-[var(--m-border)] bg-[var(--m-card)] ${liftShadow}`}>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--m-border)] bg-[var(--m-surface-2)]/60 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Webhook className="h-3.5 w-3.5 text-[var(--m-primary)]" />
          <span className="text-[11.5px] font-medium">Webhook delivery</span>
        </div>
        <Chip tone="success" className="h-5 px-1.5 text-[10.5px]">200</Chip>
      </div>
      <div className="space-y-2 p-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-[11.5px]">
            <span className="text-slate-500">{label}</span>
            <span className={value === 'Verified' || value === 'Delivered' ? 'font-medium text-emerald-700' : 'font-medium text-slate-800'}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingGmailCard() {
  return (
    <div className={`w-full max-w-[280px] overflow-hidden rounded-[12px] border border-[var(--m-border)] bg-[var(--m-card)] ${liftShadow}`}>
      <div className="flex items-center justify-between border-b border-[var(--m-border)] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-[11.5px] font-medium">Gmail - queued</span>
        </div>
        <Chip tone="success" className="h-5 px-1.5 text-[10.5px]">ready</Chip>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="text-[10.5px] text-slate-500">To: sarah@acme.io</div>
        <div className="text-[12.5px] font-medium">Pick up where you left off</div>
        <div className="text-[11px] leading-relaxed text-slate-600">
          Your answers are saved. One click resumes the form.
        </div>
        <span className="inline-flex h-6 items-center rounded-[6px] bg-[var(--m-primary)] px-2 text-[11px] font-medium text-white">
          Resume form
        </span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--m-border)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--m-fg)_12%,transparent)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,black,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--m-primary)_11%,transparent),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-[1240px] overflow-hidden px-6 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <div className="mx-auto w-full max-w-[300px] text-center sm:max-w-[860px]">
          <div className="flex justify-center">
            <div className="inline-flex h-7 max-w-[300px] items-center gap-2 rounded-full border border-[var(--m-border)] bg-[var(--m-surface)]/80 pl-1 pr-2.5 backdrop-blur sm:max-w-[calc(100vw-4rem)]">
              <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-1.5 text-[10.5px] font-semibold text-emerald-800">LIVE</span>
              <span className="truncate text-[12px] text-slate-600">Gmail recovery and signed webhooks</span>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          <h1 className="mx-auto mt-6 max-w-[300px] text-balance text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--m-fg)] sm:max-w-[calc(100vw-3rem)] sm:text-[54px] md:max-w-none md:text-[76px]">
            Recover the leads
            <br />
            your forms lose.
          </h1>
          <p className="mx-auto mt-6 max-w-[300px] text-pretty text-[15px] leading-[1.55] text-slate-600 sm:max-w-[620px] sm:text-[17px] md:text-[18.5px]">
            0Fill turns static forms into AI conversations, saves partial answers before submit,
            and sends Gmail follow-ups or signed webhooks when a lead drops off.
          </p>

          <HeroForm />

          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-[12.5px] text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--m-primary)]" />Preview before signup</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--m-primary)]" />Import Google Forms</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--m-primary)]" />Publish link or embed</span>
          </div>
        </div>

        <div className="relative mx-auto mt-14 hidden max-w-[calc(100vw-3rem)] sm:block sm:max-w-[1060px]">
          <HeroChatFrame />
          <div className="pointer-events-none absolute -right-5 top-10 hidden xl:block">
            <FloatingGmailCard />
          </div>
          <div className="pointer-events-none absolute -bottom-7 -left-6 hidden xl:block">
            <FloatingWebhookCard />
          </div>
          <div className="pointer-events-none absolute -bottom-8 left-8 right-8 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.10),transparent_70%)]" />
        </div>

        <div className="mx-auto mt-8 grid max-w-[300px] gap-4 sm:hidden">
          <FloatingGmailCard />
          <FloatingWebhookCard />
        </div>

        <div className="mt-8 hidden max-w-[calc(100vw-3rem)] gap-4 sm:grid lg:hidden">
          <FloatingGmailCard />
          <FloatingWebhookCard />
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = ['AI chat forms', 'Partial capture', 'Gmail recovery', 'Signed webhooks', 'Delivery logs', 'Website embed'];
  return (
    <section className="border-b border-[var(--m-border)] bg-[var(--m-surface)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-y-3 px-6 py-5 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:text-[12px] md:px-8">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="border-b border-[var(--m-border)]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-24 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>Problem</Eyebrow>
          <h2 className="mt-5 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--m-fg)] md:text-[52px]">
            Every unfinished form still contains intent.
          </h2>
        </div>
        <div className="space-y-5">
          <p className="text-pretty text-[18px] leading-[1.6] text-slate-700">
            Traditional forms wait for a submit event. If a buyer gets interrupted,
            every useful answer before that moment usually disappears.
          </p>
          <p className="text-[16px] leading-[1.65] text-slate-600">
            0Fill treats the conversation as signal. Answers are captured as the session progresses,
            drop-offs become recoverable, and your team can route the event instead of guessing what happened.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Before submit', 'answers can still be saved'],
              ['After drop-off', 'Gmail can resume the session'],
              ['After recovery', 'webhooks route the lead'],
            ].map(([value, label]) => (
              <div key={value} className={`rounded-[12px] border border-[var(--m-border)] bg-[var(--m-card)] p-4 ${cardShadow}`}>
                <div className="text-[15px] font-semibold text-[var(--m-fg)]">{value}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { icon: MessageSquare, title: 'Capture', desc: 'Turn a static form into a guided AI conversation that saves answers as the lead progresses.' },
    { icon: Mail, title: 'Recover', desc: 'Queue a Gmail follow-up with a resume link when a high-intent session goes quiet.' },
    { icon: Webhook, title: 'Route', desc: 'Send signed events for completed, abandoned, recovered, and failed submissions.' },
  ];

  return (
    <section id="how-it-works" className="border-b border-[var(--m-border)] bg-[var(--m-surface-2)]/40">
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Workflow</Eyebrow>
          <h2 className="mt-5 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[52px]">
            Capture. Recover. Route.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
            Three primitives turn form abandonment into an operational workflow.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className={`rounded-[14px] border border-[var(--m-border)] bg-[var(--m-card)] p-6 ${cardShadow}`}>
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-emerald-50 text-[var(--m-primary)]">
                  <step.icon className="h-[18px] w-[18px]" />
                </div>
                <span className="font-mono text-[12px] text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-slate-600">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductModules() {
  const modules = [
    {
      icon: MessageSquare,
      title: 'AI conversational forms',
      desc: 'Ask one question at a time while preserving structure, validation, and progress.',
      visual: <ChatMiniVisual />,
    },
    {
      icon: Zap,
      title: 'Partial response capture',
      desc: 'Save useful lead details before the final submit button appears.',
      visual: <CaptureMiniVisual />,
    },
    {
      icon: Mail,
      title: 'Gmail recovery campaigns',
      desc: 'Send follow-ups from a connected Google mailbox with resume links.',
      visual: <EmailMiniVisual />,
    },
    {
      icon: Webhook,
      title: 'Signed webhooks',
      desc: 'Push completed, abandoned, recovered, and failed events to your workflow tools.',
      visual: <WebhookMiniVisual />,
    },
    {
      icon: BarChart3,
      title: 'Analytics and delivery logs',
      desc: 'Review drop-off, recovered leads, email delivery, webhook retries, and skipped events.',
      visual: <AnalyticsMiniVisual />,
    },
    {
      icon: Code2,
      title: 'Light and dark themes',
      desc: 'Publish chats that feel native on bright landing pages or darker product surfaces.',
      visual: <ThemeMiniVisual />,
    },
  ];

  return (
    <section id="features" className="border-b border-[var(--m-border)]">
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:px-8">
        <div className="max-w-2xl">
          <Eyebrow>Product</Eyebrow>
          <h2 className="mt-5 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[52px]">
            Everything needed to stop losing leads.
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-slate-600">
            The public form experience and the operational recovery layer live in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <article key={module.title} className={`overflow-hidden rounded-[14px] border border-[var(--m-border)] bg-[var(--m-card)] ${cardShadow}`}>
              <div className="h-[190px] border-b border-[var(--m-border)] bg-[var(--m-surface-2)]/55 p-4">
                {module.visual}
              </div>
              <div className="p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[9px] bg-emerald-50 text-[var(--m-primary)]">
                  <module.icon className="h-4 w-4" />
                </div>
                <h3 className="text-[16.5px] font-semibold tracking-[-0.015em]">{module.title}</h3>
                <p className="mt-1.5 max-w-[42ch] text-[13.5px] leading-relaxed text-slate-600">{module.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatMiniVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="w-[78%] rounded-[10px] rounded-tl-[3px] bg-white px-3 py-2 text-[12px] shadow-sm">What is your timeline?</div>
      <div className="ml-auto w-[70%] rounded-[10px] rounded-tr-[3px] bg-[var(--m-ink)] px-3 py-2 text-[12px] text-white">This quarter.</div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full w-[62%] rounded-full bg-[var(--m-primary)]" />
      </div>
    </div>
  );
}

function CaptureMiniVisual() {
  return (
    <div className="space-y-2 rounded-[12px] border border-[var(--m-border)] bg-white p-4">
      {['name', 'email', 'company', 'budget'].map((item, index) => (
        <div key={item} className="flex items-center justify-between text-[12px]">
          <span className="font-mono text-slate-500">{item}</span>
          {index < 3 ? <Check className="h-3.5 w-3.5 text-[var(--m-primary)]" /> : <span className="h-3.5 w-3.5 rounded-full border border-dashed border-slate-300" />}
        </div>
      ))}
    </div>
  );
}

function EmailMiniVisual() {
  return (
    <div className="rounded-[12px] border border-[var(--m-border)] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">Gmail - queued</span>
        <Chip tone="success" className="h-5 px-1.5 text-[10px]">ready</Chip>
      </div>
      <div className="text-[13px] font-semibold">Resume your form</div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">Your answers are saved. Continue where you left off.</p>
      <div className="mt-3 inline-flex h-7 items-center rounded-[7px] bg-[var(--m-primary)] px-3 text-[11px] font-medium text-white">Resume</div>
    </div>
  );
}

function WebhookMiniVisual() {
  const deliveries = [
    ['Completed', 'Delivered'],
    ['Abandoned', 'Delivered'],
    ['Recovered', 'Delivered'],
    ['Failed', 'Retrying'],
  ];

  return (
    <div className="space-y-2 rounded-[12px] border border-[var(--m-border)] bg-white p-4">
      {deliveries.map(([event, status]) => (
        <div key={event} className="flex items-center justify-between rounded-[8px] bg-[var(--m-surface-2)] px-3 py-2 text-[11.5px]">
          <span className="font-medium text-slate-700">{event}</span>
          <span className={status === 'Retrying' ? 'text-amber-700' : 'text-emerald-700'}>{status}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsMiniVisual() {
  return (
    <div className="flex h-full items-end gap-2 rounded-[12px] border border-[var(--m-border)] bg-white p-4">
      {[35, 58, 46, 70, 62, 84].map((height, index) => (
        <div key={index} className="flex flex-1 items-end rounded bg-emerald-50">
          <div className="w-full rounded bg-[var(--m-primary)]" style={{ height: `${height}%` }} />
        </div>
      ))}
    </div>
  );
}

function ThemeMiniVisual() {
  return (
    <div className="grid h-full grid-cols-2 gap-3">
      <div className="rounded-[12px] border border-[var(--m-border)] bg-white p-3">
        <div className="mb-3 h-2 w-16 rounded-full bg-slate-200" />
        <div className="rounded-[10px] bg-emerald-50 p-3 text-[11px] leading-relaxed text-slate-700">
          Bright form page
        </div>
        <div className="mt-3 h-8 rounded-[8px] bg-[var(--m-primary)]" />
      </div>
      <div className="rounded-[12px] border border-slate-800 bg-slate-950 p-3">
        <div className="mb-3 h-2 w-16 rounded-full bg-white/20" />
        <div className="rounded-[10px] bg-white/10 p-3 text-[11px] leading-relaxed text-white/80">
          Dark product UI
        </div>
        <div className="mt-3 h-8 rounded-[8px] bg-emerald-400" />
      </div>
    </div>
  );
}

function DeliverySection() {
  const routes = [
    { icon: Mail, title: 'Gmail recovery', desc: 'Follow-up queued from the connected mailbox.', status: 'Ready' },
    { icon: Webhook, title: 'Signed webhook', desc: 'Lead event delivered to your workflow endpoint.', status: 'Verified' },
    { icon: BarChart3, title: 'Delivery health', desc: 'Retries, skipped events, and failures stay visible.', status: 'Tracked' },
  ];

  return (
    <section id="integrations" className="relative overflow-hidden border-b border-white/5 bg-[var(--m-ink)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-6 py-24 md:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <Eyebrow tone="ink">Delivery</Eyebrow>
          <h2 className="mt-5 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[52px]">
            Send lead events
            <br />
            where work happens.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/60">
            0Fill keeps the public form, recovery follow-up, and routing layer connected without turning the homepage into developer docs.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              ['Google-native', 'Import forms and send recovery through Gmail'],
              ['Workflow-ready', 'Route completed, abandoned, and recovered events'],
              ['Observable', 'Track queued, sent, failed, retried, and skipped deliveries'],
              ['Theme-aware', 'Publish chats that fit light or dark customer pages'],
            ].map(([title, text]) => (
              <li key={title} className="flex items-start gap-3">
                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/20">
                  <Check className="h-2.5 w-2.5 text-[var(--m-primary-ink)]" />
                </div>
                <div>
                  <div className="text-[13.5px] font-medium text-white/90">{title}</div>
                  <div className="text-[13px] text-white/55">{text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4">
          {routes.map((route) => (
            <article key={route.title} className="rounded-[14px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.45)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/10 text-emerald-300">
                    <route.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">{route.title}</h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{route.desc}</p>
                  </div>
                </div>
                <Chip tone="ink">{route.status}</Chip>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Queued', 'Sent', route.status].map((step, index) => (
                  <div key={`${route.title}-${step}`} className="rounded-[9px] border border-white/10 bg-white/[0.04] px-3 py-2">
                    <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-emerald-300" style={{ width: `${index === 0 ? 45 : index === 1 ? 75 : 100}%` }} />
                    </div>
                    <p className="text-[11px] text-white/55">{step}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[14px] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/45">Light theme</p>
              <div className="mt-4 rounded-[12px] bg-white p-4 text-slate-950">
                <div className="mb-3 h-2 w-20 rounded-full bg-slate-200" />
                <div className="rounded-[10px] bg-emerald-50 p-3 text-[12px]">Public form on a bright site</div>
              </div>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/45">Dark theme</p>
              <div className="mt-4 rounded-[12px] bg-slate-950 p-4 text-white ring-1 ring-white/10">
                <div className="mb-3 h-2 w-20 rounded-full bg-white/20" />
                <div className="rounded-[10px] bg-white/10 p-3 text-[12px]">Embedded chat on a dark product page</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecoveryFlow() {
  const events = [
    { time: 'T+0s', icon: MessageSquare, label: 'Form opened', meta: 'Acme demo', tone: 'muted' },
    { time: 'T+2:14', icon: Zap, label: 'Partial saved', meta: '2 of 4 fields - email in progress', tone: 'success' },
    { time: 'T+3:47', icon: Clock, label: 'Session abandoned', meta: 'tab closed at step 2', tone: 'warn' },
    { time: 'T+15:00', icon: Mail, label: 'Gmail follow-up queued', meta: 'resume link inserted', tone: 'muted' },
    { time: 'T+19:22', icon: Check, label: 'Lead recovered', meta: 'form completed', tone: 'success' },
    { time: 'T+19:22', icon: Webhook, label: 'Recovered lead routed', meta: 'Webhook delivered and verified', tone: 'success' },
  ];

  return (
    <section id="recovery" className="border-b border-[var(--m-border)]">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-6 py-24 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>Recovery flow</Eyebrow>
          <h2 className="mt-5 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[52px]">
            One lead,
            <br />
            end to end.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-slate-600">
            Follow a form session from open to recovered. Every handoff is visible and inspectable.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <MarketingButton href="/start-free">
              <Play className="h-3.5 w-3.5" />
              Preview recovery
            </MarketingButton>
            <MarketingButton href="/case-studies" variant="secondary">
              Use cases
            </MarketingButton>
          </div>
        </div>

        <div className={`overflow-hidden rounded-[14px] border border-[var(--m-border)] bg-[var(--m-card)] ${cardShadow}`}>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--m-border)] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-600" />
              <span className="text-[13.5px] font-semibold">Session replay - Acme demo</span>
            </div>
            <Chip tone="success">Recovered</Chip>
          </div>
          <ol className="relative space-y-4 p-5 pl-10">
            <div className="absolute bottom-6 left-[26px] top-6 w-px bg-[var(--m-border)]" />
            {events.map((event) => {
              const Icon = event.icon;
              const dot =
                event.tone === 'success'
                  ? 'bg-[var(--m-primary)] text-white'
                  : event.tone === 'warn'
                    ? 'border border-amber-200 bg-amber-50 text-amber-700'
                    : 'border border-[var(--m-border)] bg-[var(--m-surface-2)] text-slate-500';

              return (
                <li key={`${event.time}-${event.label}`} className="relative flex items-start gap-3.5">
                  <div className={`absolute -left-[26px] flex h-5 w-5 items-center justify-center rounded-full ${dot}`}>
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                  <div className="flex flex-1 items-baseline justify-between gap-4">
                    <div>
                      <div className="text-[13.5px] font-medium text-slate-800">{event.label}</div>
                      <div className="mt-0.5 text-[12px] text-slate-500">{event.meta}</div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-slate-500">{event.time}</span>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="grid grid-cols-3 gap-2 border-t border-[var(--m-border)] bg-[var(--m-surface-2)]/40 px-5 py-4">
            {[
              ['State', 'Recovered'],
              ['Email', 'Queued'],
              ['Webhook', 'Delivered'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500">{label}</div>
                <div className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em]">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const useCases = [
    {
      icon: Users,
      title: 'Lead generation agencies',
      desc: 'Recover client leads from paid traffic and send events into each client workflow.',
    },
    {
      icon: Briefcase,
      title: 'SaaS demo requests',
      desc: 'Qualify buyers conversationally and recover demo requests that stop midway.',
    },
    {
      icon: GraduationCap,
      title: 'Recruiting and applications',
      desc: 'Let candidates pause and resume longer intake flows without losing answers.',
    },
    {
      icon: Wrench,
      title: 'Service consultations',
      desc: 'Capture quote, booking, and consultation context before the visitor leaves.',
    },
  ];

  return (
    <section className="border-b border-[var(--m-border)] bg-[var(--m-surface-2)]/40">
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:px-8">
        <div className="mb-14 max-w-2xl">
          <Eyebrow>Use cases</Eyebrow>
          <h2 className="mt-5 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[52px]">
            Built for teams whose pipeline starts in a form.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {useCases.map((useCase) => (
            <Link
              key={useCase.title}
              href="/case-studies"
              className={`group flex items-start gap-5 rounded-[14px] border border-[var(--m-border)] bg-[var(--m-card)] p-6 transition-all hover:border-[var(--m-border-strong)] hover:shadow-[0_1px_2px_rgb(15_23_20/0.04),0_8px_24px_-12px_rgb(15_23_20/0.08)] md:p-7`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50">
                <useCase.icon className="h-[18px] w-[18px] text-[var(--m-primary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[16.5px] font-semibold tracking-[-0.015em]">{useCase.title}</h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900" />
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">{useCase.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="border-b border-[var(--m-border)]">
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:px-8 md:py-32">
        <div className="relative overflow-hidden rounded-[20px] border border-[var(--m-border)] bg-[var(--m-card)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--m-fg)_5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--m-fg)_5%,transparent)_1px,transparent_1px)] bg-[size:56px_56px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--m-primary)_14%,transparent),transparent_70%)]" />
          <div className="relative flex flex-col items-center p-8 text-center md:p-16">
            <Chip tone="success" className="mb-6">
              <span className="h-1 w-1 rounded-full bg-[var(--m-primary)]" />
              Live preview
            </Chip>
            <h2 className="max-w-3xl text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[60px]">
              Paste a form URL.
              <br />
              See what 0Fill can recover.
            </h2>
            <p className="mt-5 max-w-md text-[16px] text-slate-600">
              Start from an existing Google Form, preview the conversation, then save it when you are ready to publish.
            </p>
            <div className="mt-9">
              <MarketingButton href="/start-free">
                Start with a form
                <ArrowRight className="h-4 w-4" />
              </MarketingButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketingHome() {
  return (
    <div style={marketingVars} className="min-h-screen overflow-x-hidden bg-[var(--m-bg)] text-[var(--m-fg)] selection:bg-emerald-200">
      <Hero />
      <ProofStrip />
      <Problem />
      <Workflow />
      <ProductModules />
      <DeliverySection />
      <RecoveryFlow />
      <UseCases />
      <FinalCTA />
    </div>
  );
}
