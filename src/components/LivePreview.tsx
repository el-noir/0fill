'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Mail, MessageSquare, Webhook } from 'lucide-react';

const typedInput = 'We need onboarding for 40 sales reps next month.';

export function LivePreview() {
  const [typedText, setTypedText] = useState('');
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const timeouts: NodeJS.Timeout[] = [];

    const animate = () => {
      setTypedText('');
      setStage(0);
      let index = 0;

      intervalId = setInterval(() => {
        setTypedText(typedInput.slice(0, index + 1));
        index += 1;

        if (index > typedInput.length) {
          clearInterval(intervalId);
          timeouts.push(setTimeout(() => setStage(1), 500));
          timeouts.push(setTimeout(() => setStage(2), 1200));
          timeouts.push(setTimeout(() => setStage(3), 1900));
          timeouts.push(setTimeout(animate, 5400));
        }
      }, 34);
    };

    animate();

    return () => {
      clearInterval(intervalId);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section id="recovery" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
              Recovery flow
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              The drop-off becomes an action, not a dead end.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            When someone leaves mid-conversation, 0Fill keeps their answers,
            queues a recovery email, and sends the event to the tools your team already uses.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-950">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Public AI form</p>
                <p className="text-xs text-slate-400">Lead qualification preview</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="max-w-[82%] rounded-xl rounded-tl-sm border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
                What are you trying to solve?
              </div>
              <div className="ml-auto max-w-[86%] rounded-xl rounded-tr-sm bg-emerald-400 p-4 text-sm font-medium text-slate-950">
                {typedText}
                <span className="animate-pulse">|</span>
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Conversation progress</span>
                <span>64%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                  style={{ width: stage > 0 ? '64%' : '28%' }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Automatic recovery</p>
                <p className="text-xs text-slate-400">Triggered after abandonment</p>
              </div>
              <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[11px] font-bold uppercase text-emerald-300">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {[
                { icon: CheckCircle2, label: 'Partial response saved', active: stage >= 1 },
                { icon: Mail, label: 'Gmail follow-up queued', active: stage >= 2 },
                { icon: Webhook, label: 'Webhook event delivered', active: stage >= 3 },
              ].map(({ icon: Icon, label, active }) => (
                <div key={label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900 p-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-md ${
                      active ? 'bg-emerald-400 text-slate-950' : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={active ? 'text-sm font-medium text-white' : 'text-sm text-slate-500'}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
