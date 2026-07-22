'use client';

import React, { CSSProperties, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  ArrowRight,
  Check,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  RotateCcw,
  Save,
  Send,
  Webhook,
  Zap,
} from 'lucide-react';
import { startChat, replyChat } from '@/lib/api/chat';
import { ChatProgress } from '@/components/chat/ChatProgress';
import { FieldProgress, ProgressDetail } from '@/components/chat/types';

type CheckFreeForm = {
  url: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

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

const previewSignals = [
  { label: 'Import', value: 'Google Form structure', icon: MessageSquare },
  { label: 'Preview', value: 'AI conversation flow', icon: Zap },
  { label: 'Recover', value: 'Gmail and webhook ready', icon: Mail },
];

const routeItems = [
  { label: 'Partial answers', value: 'saved during the session', tone: 'emerald' },
  { label: 'Abandonment', value: 'follow-up can be queued', tone: 'amber' },
  { label: 'Completed lead', value: 'sent to webhook routes', tone: 'slate' },
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

function Eyebrow({ children, tone = 'primary' }: { children: React.ReactNode; tone?: 'primary' | 'ink' }) {
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

function PreviewConsole() {
  return (
    <aside className={`relative overflow-hidden rounded-[8px] border border-[var(--m-border)] bg-[var(--m-card)] p-3 ${liftShadow}`}>
      <div className="rounded-[8px] border border-slate-800 bg-[var(--m-ink)] p-4 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[12px] font-medium text-white/50">Preview session</p>
            <p className="mt-1 text-[15px] font-semibold">Acme demo request</p>
          </div>
          <span className="rounded-[6px] border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
            Live
          </span>
        </div>

        <div className="space-y-4 py-5">
          <div className="max-w-[82%] rounded-[8px] border border-white/10 bg-white/[0.08] p-3">
            <p className="text-[13px] leading-6 text-white/80">
              What should the sales team know before they call?
            </p>
          </div>
          <div className="ml-auto max-w-[78%] rounded-[8px] bg-emerald-300 p-3 text-[13px] leading-6 text-slate-950">
            We are comparing form tools for paid acquisition.
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <span className="h-1.5 rounded-full bg-emerald-300" />
            <span className="h-1.5 rounded-full bg-emerald-300" />
            <span className="h-1.5 rounded-full bg-amber-300" />
            <span className="h-1.5 rounded-full bg-white/[0.12]" />
          </div>
        </div>

        <div className="grid gap-2">
          {routeItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2.5">
              <div>
                <p className="text-[12px] font-medium text-white">{item.label}</p>
                <p className="mt-0.5 text-[11.5px] text-white/45">{item.value}</p>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  item.tone === 'emerald' ? 'bg-emerald-300' : item.tone === 'amber' ? 'bg-amber-300' : 'bg-slate-300'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {previewSignals.map((signal) => (
          <div key={signal.label} className="rounded-[8px] border border-[var(--m-border)] bg-[var(--m-surface-2)] p-3">
            <signal.icon className="mb-3 h-4 w-4 text-[var(--m-primary)]" />
            <p className="text-[12px] font-semibold text-[var(--m-fg)]">{signal.label}</p>
            <p className="mt-1 text-[11.5px] leading-5 text-slate-500">{signal.value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function StartFreeContent() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [collectedData, setCollectedData] = useState<Record<string, string> | null>(null);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState<string>('IDLE');
  const [progressDetail, setProgressDetail] = useState<ProgressDetail | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [totalFields, setTotalFields] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const buildSyntheticProgress = useCallback((answered: number, total: number): ProgressDetail => {
    const clamped = Math.min(answered, total);
    const percentage = total > 0 ? Math.round((clamped / total) * 100) : 0;
    const fields: FieldProgress[] = Array.from({ length: total }, (_, i) => ({
      fieldId: `field-${i}`,
      label: `Question ${i + 1}`,
      status: i < clamped ? 'completed' : i === clamped ? 'current' : 'upcoming',
      questionNumber: i + 1,
      sectionIndex: 0,
    }));

    return {
      percentage,
      answeredCount: clamped,
      totalFields: total,
      currentFieldIndex: clamped,
      fields,
      totalPages: 1,
      currentPage: 1,
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckFreeForm>({
    mode: 'onBlur',
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onStart = async (data: CheckFreeForm) => {
    setError('');
    setLoading(true);

    try {
      const response = await startChat(data.url);
      setSessionId(response.sessionId);
      setChatState(response.state || 'IN_PROGRESS');
      setFormTitle(response.formTitle || '');
      const total = response.totalFields ?? response.progressDetail?.totalFields ?? 0;
      setTotalFields(total);
      setAnsweredCount(0);

      if (response.progressDetail) {
        setProgressDetail(response.progressDetail);
      } else if (total > 0) {
        setProgressDetail(buildSyntheticProgress(0, total));
      }

      setMessages([{ id: Date.now().toString(), role: 'assistant', content: response.message }]);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err) || 'Failed to start conversation from the URL.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam && !sessionId && !loading) {
      onStart({ url: urlParam });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId || sendingMsg || isComplete) return;

    const userText = inputValue.trim();
    setInputValue('');
    setError('');
    setSendingMsg(true);

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await replyChat(sessionId, userText);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (response.state) {
        setChatState(response.state);
      }

      const newAnswered = answeredCount + 1;
      if (response.progressDetail) {
        setProgressDetail(response.progressDetail);
        setAnsweredCount(response.progressDetail.answeredCount);
      } else if (totalFields > 0) {
        setAnsweredCount(newAnswered);
        setProgressDetail(buildSyntheticProgress(newAnswered, totalFields));
      }

      if (response.isComplete) {
        setIsComplete(true);
        setChatState('COMPLETED');
        if (totalFields > 0 && !response.progressDetail) {
          setProgressDetail(buildSyntheticProgress(totalFields, totalFields));
        }
        setCollectedData(response.collectedData);
      }
    } catch (err: unknown) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleRestart = () => {
    setSessionId(null);
    setMessages([]);
    setIsComplete(false);
    setCollectedData(null);
    setChatState('IDLE');
    setProgressDetail(null);
    setFormTitle('');
    setTotalFields(0);
    setAnsweredCount(0);
    setError('');
  };

  return (
    <main style={marketingVars} className="min-h-[calc(100vh-5rem)] bg-[var(--m-bg)] text-[var(--m-fg)]">
      {!sessionId ? (
        <section className="relative overflow-hidden border-b border-[var(--m-border)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(15_23_20/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(15_23_20/0.045)_1px,transparent_1px)] bg-[size:56px_56px] opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_14%,transparent_70%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1240px] items-center gap-12 px-6 py-16 md:px-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
            <section className="max-w-2xl">
              <Eyebrow>Preview 0Fill</Eyebrow>
              <h1 className="mt-5 text-balance text-[42px] font-semibold leading-[1.03] text-[var(--m-fg)] md:text-[64px]">
                Start with the form you already have.
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-8 text-slate-600">
                Paste a Google Form URL and see how 0Fill turns it into a guided conversation with progress,
                partial capture, recovery, and routing built around the same lead.
              </p>

              <form
                onSubmit={handleSubmit(onStart)}
                className={`mt-9 rounded-[8px] border border-[var(--m-border)] bg-[var(--m-card)] p-2 ${cardShadow}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Paste Google Form URL"
                    {...register('url', { required: 'URL is required' })}
                    className="min-w-0 flex-1 rounded-[6px] border border-transparent bg-[var(--m-surface-2)] px-4 py-3.5 text-[15px] text-[var(--m-fg)] outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[var(--m-primary)] px-5 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting
                      </>
                    ) : (
                      <>
                        Preview chat
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
                {errors.url && <p className="px-2 pt-2 text-sm text-red-600">{errors.url.message}</p>}
                {error && <p className="px-2 pt-2 text-sm text-red-600">{error}</p>}
              </form>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {['No account needed for preview', 'Google Forms first', 'Save when ready'].map((label) => (
                  <span key={label} className="rounded-[6px] border border-[var(--m-border)] bg-[var(--m-surface)] px-3 py-1.5 text-[12px] font-medium text-slate-600">
                    {label}
                  </span>
                ))}
              </div>
            </section>

            <PreviewConsole />
          </div>
        </section>
      ) : (
        <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1240px] gap-6 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,0.74fr)_minmax(280px,0.26fr)]">
          <div className={`flex min-h-[720px] flex-col overflow-hidden rounded-[8px] border border-slate-800 bg-[var(--m-ink)] ${liftShadow}`}>
            <div className="shrink-0">
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-[var(--m-ink-2)] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-emerald-300 text-slate-950">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[16px] font-semibold text-white">
                      {formTitle || '0Fill Assistant'}
                    </h2>
                    <p className="text-[12px] font-medium text-slate-400">
                      {chatState === 'COMPLETED' ? (
                        <span className="text-emerald-300">Completed</span>
                      ) : chatState === 'ERROR' ? (
                        <span className="text-red-400">Submission failed</span>
                      ) : progressDetail ? (
                        <span>
                          Question {Math.min(progressDetail.currentFieldIndex + 1, progressDetail.totalFields)} of{' '}
                          {progressDetail.totalFields} - {progressDetail.percentage}%
                        </span>
                      ) : (
                        <span>Session active</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRestart}
                  className="flex shrink-0 items-center gap-2 rounded-[6px] border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  Restart
                </button>
              </div>

              {progressDetail && chatState !== 'COMPLETED' && (
                <ChatProgress progressDetail={progressDetail} chatState={chatState} />
              )}
              {!progressDetail && chatState !== 'COMPLETED' && chatState !== 'IDLE' && totalFields > 0 && (
                <div className="border-b border-white/10 bg-slate-950 px-4 py-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Question {Math.min(answeredCount + 1, totalFields)} of {totalFields}
                    </span>
                    <span className="text-[10px] tabular-nums text-slate-500">
                      {totalFields > 0 ? Math.round((answeredCount / totalFields) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-700 ease-out"
                      style={{ width: `${totalFields > 0 ? Math.round((answeredCount / totalFields) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-4 scroll-smooth md:p-8">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-[8px] p-4 text-sm shadow-sm md:max-w-[75%] md:text-[15px] ${
                      msg.role === 'user'
                        ? 'bg-emerald-300 text-slate-950'
                        : 'border border-white/10 bg-white/[0.07] text-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {sendingMsg && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="flex items-center gap-1.5 rounded-[8px] border border-white/10 bg-white/[0.07] px-5 py-4">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              {error && (
                <div className="w-full text-center animate-in fade-in duration-300">
                  <span className="inline-block rounded-[8px] border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300">
                    {error}
                  </span>
                </div>
              )}

              {isComplete && (
                <div className="mt-8 rounded-[8px] border border-emerald-400/20 bg-emerald-400/10 p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 md:p-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[8px] bg-emerald-300 text-slate-950">
                    <Save className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold text-white">Preview complete</h3>
                  <p className="mx-auto mb-7 max-w-md text-sm leading-6 text-slate-300">
                    Save this form to publish the chat, embed it on your site, and enable recovery for abandoned responses.
                  </p>

                  <Link
                    href={`/sign-up?url=${encodeURIComponent(searchParams.get('url') || '')}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
                  >
                    Save and publish this form
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {collectedData && (
                    <div className="mt-7 grid gap-2 text-left sm:grid-cols-2">
                      {Object.entries(collectedData).map(([key, value]) => (
                        <div key={key} className="rounded-[8px] border border-white/10 bg-slate-950/55 p-3">
                          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{key}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-200">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={`relative z-10 border-t border-white/10 bg-[var(--m-ink)] p-4 transition-opacity md:p-6 ${isComplete ? 'pointer-events-none opacity-50' : 'opacity-100'}`}>
              <form onSubmit={handleSendMessage} className="relative mx-auto flex w-full max-w-3xl items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer here..."
                  disabled={sendingMsg || isComplete}
                  className="w-full rounded-[8px] border border-white/10 bg-white/[0.06] py-4 pl-5 pr-16 text-base text-white shadow-inner outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-300/10 md:py-5"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || sendingMsg || isComplete}
                  className="absolute right-3 flex items-center justify-center rounded-[6px] bg-emerald-300 p-2.5 text-slate-950 transition hover:bg-emerald-200 disabled:opacity-50 md:p-3"
                >
                  <Send className="ml-0.5 h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              <div className={`rounded-[8px] border border-[var(--m-border)] bg-[var(--m-card)] p-5 ${cardShadow}`}>
                <Eyebrow>Session state</Eyebrow>
                <div className="mt-5 space-y-3">
                  {[
                    { icon: MessageSquare, label: 'Conversation', value: chatState === 'COMPLETED' ? 'complete' : 'active' },
                    { icon: Clock, label: 'Progress', value: progressDetail ? `${progressDetail.percentage}%` : 'starting' },
                    { icon: Webhook, label: 'Routing', value: isComplete ? 'ready to save' : 'waiting' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-[8px] border border-[var(--m-border)] bg-[var(--m-surface-2)] p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-emerald-50 text-[var(--m-primary)]">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-slate-500">{item.label}</p>
                        <p className="text-[14px] font-semibold text-[var(--m-fg)]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-900">
                  <Check className="h-4 w-4" />
                  Product preview
                </div>
                <p className="mt-2 text-[13px] leading-6 text-emerald-950/75">
                  This is the same respondent experience you can publish after saving the imported form.
                </p>
              </div>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

export default function StartFreePage() {
  return (
    <Suspense
      fallback={
        <main style={marketingVars} className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[var(--m-bg)]">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[var(--m-primary)]" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </main>
      }
    >
      <StartFreeContent />
    </Suspense>
  );
}
