"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  ShieldCheck,
  Webhook,
  Zap,
} from "lucide-react";
import { loginUser, loginWithGoogle } from "@/lib/api/auth";
import { LoginDto } from "@/app/types/Auth";
import { useAuth } from "@/hooks/useAuth";

const revealEase = [0.16, 1, 0.3, 1] as const;

const productBullets = [
  {
    icon: MessageSquare,
    title: "Conversational forms",
    body: "Review the AI form sessions your visitors started.",
  },
  {
    icon: Zap,
    title: "Abandoned lead recovery",
    body: "Track partial answers, resume links, and follow-up state.",
  },
  {
    icon: Webhook,
    title: "Delivery visibility",
    body: "Inspect Gmail and webhook handoffs from one workspace.",
  },
];

function getAuthErrorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}

function AuthMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 rounded-[8px] focus:outline-none focus:ring-4 focus:ring-emerald-100">
      <span className="relative flex h-9 w-9 overflow-hidden rounded-[8px] bg-slate-950">
        <Image src="/logo.png" alt="0Fill" fill className="object-contain p-1.5" />
      </span>
      <span className="text-[15px] font-semibold text-slate-950">0Fill</span>
    </Link>
  );
}

function ProductPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center px-12 py-10">
      <motion.div
        className="w-full max-w-[560px]"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: revealEase }}
      >
        <AuthMark />

        <div className="mt-12">
          <p className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-emerald-700">
            Workspace access
          </p>
          <h1 className="mt-4 text-[46px] font-semibold leading-[1.04] tracking-tight text-slate-950">
            Return to the leads your forms almost lost.
          </h1>
          <p className="mt-5 max-w-[520px] text-[16px] leading-8 text-slate-600">
            Sign in to manage AI form sessions, recovery campaigns, delivery health, and webhook routing.
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          {productBullets.map((item, index) => (
            <motion.div
              key={item.title}
              className="flex items-start gap-3 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgb(15_23_20/0.04),0_8px_24px_-12px_rgb(15_23_20/0.08)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + index * 0.1, ease: revealEase }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[7px] bg-emerald-50 text-emerald-700">
                <item.icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-slate-950">{item.title}</span>
                <span className="mt-0.5 block text-[13px] leading-6 text-slate-500">{item.body}</span>
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_70px_-34px_rgb(15_23_42/0.45)]"
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.42, ease: revealEase }}
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="rounded-[6px] border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800">
              Recovery active
            </span>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-[1fr_0.85fr]">
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-[12px] font-medium text-slate-500">Lead session</p>
              <p className="mt-1 text-[15px] font-semibold text-slate-950">Acme demo request</p>
              <div className="mt-5 space-y-3">
                {[
                  "Email captured",
                  "Primary interest answered",
                  "Gmail follow-up sent",
                ].map((label, index) => (
                  <motion.div
                    key={label}
                    className="flex items-center gap-2 text-[13px] text-slate-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.62 + index * 0.1 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    {label}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-[8px] bg-slate-950 p-4 text-white">
              <p className="text-[12px] font-medium text-white/45">Delivery</p>
              <div className="mt-4 space-y-3">
                {[
                  ["Gmail", "queued"],
                  ["Webhook", "delivered"],
                  ["Status", "recovered"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-[7px] border border-white/10 bg-white/[0.06] px-3 py-2.5">
                    <span className="text-[12px] text-white/65">{label}</span>
                    <span className="text-[12px] font-semibold text-emerald-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({ mode: "onBlur" });

  const { isLoading: checkingAuth } = useAuth("/dashboard");

  useEffect(() => {
    if (searchParams.get("error") === "auth_failed") {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginDto) => {
    setError("");
    setLoading(true);
    try {
      await loginUser(data);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 600);
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err) || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f7f8f5]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-700" />
          <p className="text-sm text-slate-600">Loading...</p>
        </div>
      </main>
    );
  }

  const inputCls = (hasError: boolean) =>
    `w-full rounded-[8px] border bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
    }`;

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#f7f8f5] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(15_23_20/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(15_23_20/0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_72%)]" />

      <div className="relative flex min-h-[calc(100vh-5rem)]">
        <ProductPanel />

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2 lg:px-12">
          <motion.div
            className="w-full max-w-[460px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: revealEase }}
          >
            <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-34px_rgb(15_23_42/0.45)] md:p-8">
              <div className="text-center">
                <Link
                  href="/"
                  className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[8px] bg-slate-950 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                  <Image src="/logo.png" alt="0Fill" width={36} height={36} className="h-9 w-9 object-contain" />
                </Link>
                <h1 className="text-[28px] font-semibold tracking-tight text-slate-950">Sign in</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">Access your 0Fill workspace.</p>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    className="mt-6 flex items-center gap-3 rounded-[8px] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Signed in. Redirecting to dashboard...
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={inputCls(!!errors.email)}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <a href="#" className="text-xs font-medium text-emerald-700 transition hover:text-emerald-800">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                      })}
                      className={`${inputCls(!!errors.password)} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>}
                </motion.div>

                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                >
                  <input id="remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />
                  <label htmlFor="remember" className="cursor-pointer select-none text-sm text-slate-600">
                    Remember me for 30 days
                  </label>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading || success}
                  className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : success ? (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-slate-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              <p className="mt-7 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="font-semibold text-emerald-700 hover:text-emerald-800">
                  Sign up for free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f7f8f5]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
