import { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Mail, MessageSquare, MousePointerClick, Webhook, Zap } from 'lucide-react';

interface PageProps {
  params: Promise<{ niche: string }>;
  searchParams?: Promise<{ source?: string; token?: string; form?: string; org?: string }>;
}

const marketingVars = {
  '--m-bg': 'oklch(0.985 0.003 95)',
  '--m-fg': 'oklch(0.20 0.008 250)',
  '--m-surface': 'oklch(0.995 0.002 95)',
  '--m-surface-2': 'oklch(0.97 0.004 95)',
  '--m-card': 'oklch(1 0 0)',
  '--m-primary': 'oklch(0.58 0.14 158)',
  '--m-border': 'oklch(0.905 0.005 95)',
  '--m-border-strong': 'oklch(0.82 0.006 95)',
  '--m-ink': 'oklch(0.19 0.008 250)',
  '--m-ink-2': 'oklch(0.245 0.01 250)',
} as CSSProperties;

const cardShadow = 'shadow-[0_1px_2px_rgb(15_23_20/0.04),0_8px_24px_-12px_rgb(15_23_20/0.08)]';
const liftShadow = 'shadow-[0_12px_44px_-14px_rgb(15_23_20/0.18),0_2px_6px_rgb(15_23_20/0.05)]';

function titleCase(input: string): string {
  return input
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getNicheCopy(niche: string) {
  const readable = titleCase(niche || 'Growth');

  if (niche.includes('lead') || niche.includes('agency')) {
    return {
      label: 'For lead generation agencies',
      headline: 'Recover more intent from the paid traffic you already bought.',
      body: '0Fill helps agencies turn static client forms into AI conversations that capture partial answers, recover abandoned sessions, and send lead events into each client workflow.',
      chips: ['Client-ready routing', 'Abandoned lead follow-up', 'Google Form import'],
    };
  }

  if (niche.includes('saas') || niche.includes('demo')) {
    return {
      label: `For ${readable}`,
      headline: 'Turn demo forms into guided qualification conversations.',
      body: 'Capture buyer context one question at a time, preserve partial intent, and route qualified or abandoned demo requests to the right sales workflow.',
      chips: ['Demo qualification', 'Sales handoff', 'Recovered requests'],
    };
  }

  if (niche.includes('recruit') || niche.includes('candidate') || niche.includes('hiring')) {
    return {
      label: `For ${readable}`,
      headline: 'Make long application forms easier to finish.',
      body: '0Fill lets candidates move through an intake conversation, keeps answers saved, and creates a path back when they need to pause.',
      chips: ['Candidate intake', 'Resume flow', 'Pause and resume'],
    };
  }

  return {
    label: `For ${readable}`,
    headline: `Recover unfinished form intent for ${readable} teams.`,
    body: '0Fill turns existing forms into guided AI conversations, captures partial responses, and follows up when high-intent visitors leave before submitting.',
    chips: ['Partial capture', 'Gmail recovery', 'Webhook routing'],
  };
}

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

function FlowPreview() {
  const events = [
    { icon: MousePointerClick, label: 'Visitor starts', meta: 'Intent detected', tone: 'muted' },
    { icon: MessageSquare, label: 'Answers captured', meta: 'Email and context saved', tone: 'success' },
    { icon: Mail, label: 'Recovery sent', meta: 'Resume link included', tone: 'warn' },
    { icon: Webhook, label: 'Lead routed', meta: 'Workflow event delivered', tone: 'success' },
  ];

  return (
    <div className={`rounded-[8px] border border-slate-800 bg-[var(--m-ink)] p-4 text-white ${liftShadow}`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[12px] font-medium text-white/45">0Fill route</p>
          <p className="mt-1 text-[16px] font-semibold">From drop-off to handoff</p>
        </div>
        <span className="rounded-[6px] border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-medium text-emerald-100">
          Tracked
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {events.map((event, index) => (
          <div key={event.label} className="flex gap-3 rounded-[8px] border border-white/10 bg-white/[0.06] p-3">
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
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-white">{event.label}</p>
                <span className="font-mono text-[11px] text-white/30">0{index + 1}</span>
              </div>
              <p className="mt-0.5 text-[12px] leading-5 text-white/45">{event.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function NicheDiscoveryPage({ params, searchParams }: PageProps) {
  const { niche } = await params;
  const query = searchParams ? await searchParams : undefined;
  const copy = getNicheCopy(niche || 'general');
  const source = query?.source || 'badge';
  const ctaUrl = `/start-free?source=${encodeURIComponent(source)}&niche=${encodeURIComponent(niche || 'general')}`;

  return (
    <main style={marketingVars} className="min-h-screen bg-[var(--m-bg)] text-[var(--m-fg)]">
      <header className="border-b border-[var(--m-border)] bg-[var(--m-bg)]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6 md:px-8">
          <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold text-[var(--m-fg)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[var(--m-ink)] text-white">0</span>
            0Fill
          </Link>
          <Link
            href="/start-free"
            className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[var(--m-ink)] px-4 text-sm font-medium text-white transition hover:bg-[var(--m-ink-2)]"
          >
            Start free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--m-border)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(15_23_20/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(15_23_20/0.045)_1px,transparent_1px)] bg-[size:56px_56px] opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_14%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-6 py-18 md:px-8 md:py-24 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.55fr)]">
          <div className="max-w-3xl">
            <Eyebrow>{copy.label}</Eyebrow>
            <h1 className="mt-5 text-balance text-[42px] font-semibold leading-[1.03] md:text-[64px]">
              {copy.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-slate-600">{copy.body}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {copy.chips.map((chip) => (
                <span key={chip} className="rounded-[6px] border border-[var(--m-border)] bg-[var(--m-surface)] px-3 py-1.5 text-[12px] font-medium text-slate-600">
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={ctaUrl}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-[var(--m-primary)] px-[18px] text-sm font-medium text-white transition hover:brightness-95"
              >
                Preview with a form
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[var(--m-border-strong)] bg-[var(--m-surface)] px-[18px] text-sm font-medium text-[var(--m-fg)] transition hover:bg-[var(--m-surface-2)]"
              >
                Explore use cases
              </Link>
            </div>
          </div>

          <FlowPreview />
        </div>
      </section>

      <section className="border-b border-[var(--m-border)]">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-18 md:px-8 md:py-24 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div>
            <Eyebrow>Why it works</Eyebrow>
            <h2 className="mt-4 text-[34px] font-semibold leading-[1.08] md:text-[48px]">
              Traditional forms only value the final click.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: 'Conversational intake',
                body: 'Ask one thing at a time while keeping the original form structure underneath.',
              },
              {
                icon: Zap,
                title: 'Partial response capture',
                body: 'Keep useful answers before the visitor reaches the final submit button.',
              },
              {
                icon: Webhook,
                title: 'Operational delivery',
                body: 'Send recovered and abandoned lead events to the systems your team already uses.',
              },
            ].map((item) => (
              <article key={item.title} className={`rounded-[8px] border border-[var(--m-border)] bg-[var(--m-card)] p-5 ${cardShadow}`}>
                <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-[7px] bg-emerald-50 text-[var(--m-primary)]">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="text-[17px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-18 md:px-8 md:py-24">
        <div className={`mx-auto grid max-w-[1240px] gap-8 rounded-[8px] border border-[var(--m-border)] bg-[var(--m-card)] p-8 md:grid-cols-[minmax(0,0.9fr)_auto] md:items-center md:p-10 ${cardShadow}`}>
          <div>
            <Eyebrow>Start</Eyebrow>
            <h2 className="mt-4 text-[30px] font-semibold leading-tight md:text-[40px]">
              See 0Fill on a real Google Form.
            </h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {['Import the form', 'Preview the chat', 'Save the recovery workflow'].map((step) => (
                <div key={step} className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                  <Check className="h-4 w-4 text-[var(--m-primary)]" />
                  {step}
                </div>
              ))}
            </div>
          </div>
          <Link
            href={ctaUrl}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-[var(--m-ink)] px-[18px] text-sm font-medium text-white transition hover:bg-[var(--m-ink-2)]"
          >
            Preview with a form
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
