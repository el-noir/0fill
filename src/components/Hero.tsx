'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Route,
  ShieldCheck,
} from 'lucide-react';
import { startChat } from '@/lib/api/chat';

const proofPoints = [
  'Import a Google Form',
  'Preview the AI conversation',
  'Recover abandoned leads',
];

const workflowItems = [
  {
    icon: MessageSquare,
    label: 'Conversational form',
    detail: 'Collects structured answers with a guided AI chat.',
  },
  {
    icon: Mail,
    label: 'Gmail recovery',
    detail: 'Sends resume links from the connected mailbox.',
  },
  {
    icon: Route,
    label: 'Webhook routing',
    detail: 'Pushes completed and abandoned events to your stack.',
  },
];

function getApiErrorMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const response = 'response' in error ? error.response : undefined;
  if (typeof response !== 'object' || response === null) return undefined;
  const data = 'data' in response ? response.data : undefined;
  if (typeof data !== 'object' || data === null) return undefined;
  const message = 'message' in data ? data.message : undefined;
  return typeof message === 'string' ? message : undefined;
}

function ProductProof() {
  return (
    <div className="relative min-w-0 max-w-[calc(100vw-3rem)] lg:max-w-none">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="flex h-11 items-center gap-2 border-b border-slate-200 bg-slate-50 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="ml-auto hidden max-w-[150px] truncate rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500 sm:block">
            0fill.app/dashboard
          </span>
        </div>
        <div className="relative aspect-[16/10] bg-slate-950">
          <Image
            src="/image.png"
            alt="0Fill dashboard showing forms, submissions, and analytics"
            fill
            priority
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover object-left-top"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {workflowItems.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-slate-950">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Paste a Google Form URL to start.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await startChat(url.trim());
      router.push(`/start-free?url=${encodeURIComponent(url.trim())}`);
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err) ||
          'We could not read that form. Check the URL and try again.',
      );
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f8f5] px-6 pb-20 pt-16 md:pb-24 md:pt-24" aria-label="ZeroFill overview">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="min-w-0 max-w-[calc(100vw-3rem)] lg:max-w-none">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm font-medium text-emerald-800 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Built for forms with revenue behind them
          </div>

          <h1 className="max-w-[calc(100vw-3rem)] text-4xl font-semibold leading-[1.03] tracking-tight text-slate-950 sm:max-w-4xl sm:text-5xl md:text-6xl">
            AI forms that recover abandoned leads.
          </h1>

          <p className="mt-6 max-w-[calc(100vw-3rem)] text-base leading-8 text-slate-600 sm:max-w-2xl md:text-lg">
            0Fill turns static forms into AI conversations, saves partial answers,
            and sends Gmail follow-ups or webhook events when a lead drops off.
          </p>

          <div className="mt-8 max-w-[calc(100vw-3rem)] sm:max-w-2xl">
            <form onSubmit={handleSubmit} className="w-full rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  placeholder="https://docs.google.com/forms/d/e/..."
                  className="min-w-0 flex-1 rounded-lg border border-transparent bg-slate-50 px-4 py-3.5 text-base text-slate-950 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking
                    </>
                  ) : (
                    <>
                      Preview form
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              {error && <p className="px-2 pt-2 text-sm text-red-600">{error}</p>}
            </form>

            <div className="mt-5 flex max-w-[calc(100vw-3rem)] flex-col gap-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-x-5">
              {proofPoints.map((point) => (
                <div key={point} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductProof />
      </div>
    </section>
  );
}
