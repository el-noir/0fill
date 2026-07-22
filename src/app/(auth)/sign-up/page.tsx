"use client";

import React, { ReactNode, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  User,
  Webhook,
  Zap,
} from "lucide-react";
import { registerUser, loginWithGoogle } from "@/lib/api/auth";
import { RegisterDto } from "@/app/types/Auth";
import { useAuth } from "@/hooks/useAuth";

type RegisterForm = RegisterDto & { confirmPassword: string };
type StrengthLevel = "weak" | "fair" | "good" | "strong";
type PasswordCheckKey = "length" | "uppercase" | "lowercase" | "number" | "special";

const revealEase = [0.16, 1, 0.3, 1] as const;

const steps = [
  { label: "Account", icon: User },
  { label: "Security", icon: Lock },
  { label: "Company", icon: Building },
];

const passwordChecks: Array<{ key: PasswordCheckKey; label: string }> = [
  { key: "length", label: "8+ characters" },
  { key: "uppercase", label: "Uppercase letter" },
  { key: "lowercase", label: "Lowercase letter" },
  { key: "number", label: "Number" },
  { key: "special", label: "Special character" },
];

const strengthConfig: Record<StrengthLevel, { label: string; color: string; bars: number }> = {
  weak: { label: "Weak", color: "#ef4444", bars: 1 },
  fair: { label: "Fair", color: "#f59e0b", bars: 2 },
  good: { label: "Good", color: "#0f766e", bars: 3 },
  strong: { label: "Strong", color: "#059669", bars: 4 },
};

const productBullets = [
  "Import Google Forms into a guided 0Fill conversation.",
  "Capture partial answers before the final submit event.",
  "Recover abandoned leads through Gmail and route events through webhooks.",
];

function getAuthErrorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}

function getPasswordStrength(password: string): {
  level: StrengthLevel;
  score: number;
  checks: Record<PasswordCheckKey, boolean>;
} {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  let level: StrengthLevel = "weak";
  if (score >= 5) level = "strong";
  else if (score >= 4) level = "good";
  else if (score >= 3) level = "fair";
  return { level, score, checks };
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

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const done = index < current;
        const active = index === current;
        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  done
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : active
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-400"
                }`}
                animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </motion.div>
              <span className={`text-[10px] font-medium ${active ? "text-emerald-700" : "text-slate-500"}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 mb-4 h-0.5 flex-1 overflow-hidden rounded bg-slate-200">
                <motion.div
                  className="h-full bg-emerald-600"
                  initial={false}
                  animate={{ width: index < current ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease: revealEase }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function InputField({
  id,
  label,
  icon,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-emerald-700">*</span>}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
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
            Create workspace
          </p>
          <h1 className="mt-4 text-[46px] font-semibold leading-[1.04] tracking-tight text-slate-950">
            Start with the forms you already use.
          </h1>
          <p className="mt-5 max-w-[520px] text-[16px] leading-8 text-slate-600">
            Build a workspace for conversational collection, abandoned-lead recovery, and reliable handoff to your tools.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {productBullets.map((item, index) => (
            <motion.div
              key={item}
              className="flex items-start gap-3 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgb(15_23_20/0.04),0_8px_24px_-12px_rgb(15_23_20/0.08)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + index * 0.1, ease: revealEase }}
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_-34px_rgb(15_23_42/0.45)]"
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.42, ease: revealEase }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: MessageSquare, label: "Capture" },
              { icon: Zap, label: "Recover" },
              { icon: Webhook, label: "Route" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.58 + index * 0.08 }}
              >
                <item.icon className="mb-5 h-4 w-4 text-emerald-700" />
                <p className="text-[14px] font-semibold text-slate-950">{item.label}</p>
                <p className="mt-1 text-[12px] leading-5 text-slate-500">
                  {index === 0 ? "Guided chat intake" : index === 1 ? "Gmail resume links" : "Webhook delivery"}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: "onBlur" });

  const { isLoading: checkingAuth } = useAuth("/dashboard");
  const strength = getPasswordStrength(passwordValue);
  const strengthCfg = strengthConfig[strength.level];

  const nextStep = useCallback(async () => {
    const fieldsPerStep: Array<Array<keyof RegisterForm>> = [
      ["firstName", "lastName", "email"],
      ["password", "confirmPassword"],
      ["organizationName"],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((value) => Math.min(value + 1, 2));
  }, [step, trigger]);

  const prevStep = () => setStep((value) => Math.max(value - 1, 0));

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      void confirmPassword;
      await registerUser(payload);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err) || "Registration failed. Please try again.");
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

  const inputCls = (hasError: boolean, withIcon = true) =>
    `w-full rounded-[8px] border bg-white py-3.5 ${withIcon ? "pl-11" : "pl-4"} pr-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 ${
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
            className="w-full max-w-[520px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: revealEase }}
          >
            <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-34px_rgb(15_23_42/0.45)] md:p-8">
              <div className="mb-6 text-center">
                <Link
                  href="/"
                  className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[8px] bg-slate-950 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                  <Image src="/logo.png" alt="0Fill" width={36} height={36} className="h-9 w-9 object-contain" />
                </Link>
                <h1 className="text-[28px] font-semibold tracking-tight text-slate-950">Create account</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">Start building recoverable forms.</p>
              </div>

              <StepIndicator current={step} />

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mb-5 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div
                      key="account"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <InputField id="firstName" label="First name" icon={<User className="h-4 w-4" />} error={errors.firstName?.message} required>
                          <input
                            id="firstName"
                            type="text"
                            placeholder="Ada"
                            {...register("firstName", {
                              required: "Required",
                              minLength: { value: 2, message: "Min 2 chars" },
                            })}
                            className={inputCls(!!errors.firstName)}
                          />
                        </InputField>

                        <InputField id="lastName" label="Last name" icon={<User className="h-4 w-4" />} error={errors.lastName?.message} required>
                          <input
                            id="lastName"
                            type="text"
                            placeholder="Lovelace"
                            {...register("lastName", {
                              required: "Required",
                              minLength: { value: 2, message: "Min 2 chars" },
                            })}
                            className={inputCls(!!errors.lastName)}
                          />
                        </InputField>
                      </div>

                      <InputField id="email" label="Work email" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} required>
                        <input
                          id="email"
                          type="email"
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
                      </InputField>

                      <motion.button
                        type="button"
                        onClick={nextStep}
                        className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <InputField id="password" label="Password" icon={<Lock className="h-4 w-4" />} error={errors.password?.message} required>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Create a password"
                            {...register("password", {
                              required: "Password is required",
                              minLength: { value: 8, message: "Password must be at least 8 characters" },
                              onChange: (event) => setPasswordValue(event.target.value),
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
                      </InputField>

                      {passwordValue && (
                        <motion.div
                          className="rounded-[8px] border border-slate-200 bg-slate-50 p-3"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="mb-2 flex gap-1.5">
                            {[1, 2, 3, 4].map((bar) => (
                              <span
                                key={bar}
                                className="h-1.5 flex-1 rounded-full transition-colors"
                                style={{ backgroundColor: bar <= strengthCfg.bars ? strengthCfg.color : "rgb(226 232 240)" }}
                              />
                            ))}
                          </div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold" style={{ color: strengthCfg.color }}>
                              {strengthCfg.label}
                            </span>
                            <span className="text-xs text-slate-500">{strength.score}/5 criteria met</span>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-2">
                            {passwordChecks.map(({ key, label }) => (
                              <div key={key} className="flex items-center gap-1.5">
                                {strength.checks[key] ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Circle className="h-3.5 w-3.5 text-slate-300" />
                                )}
                                <span className={`text-[11px] ${strength.checks[key] ? "text-slate-700" : "text-slate-400"}`}>
                                  {label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <InputField id="confirmPassword" label="Confirm password" icon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message} required>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) => value === watch("password") || "Passwords do not match",
                              onChange: (event) => setConfirmValue(event.target.value),
                            })}
                            className={`${inputCls(!!errors.confirmPassword)} pr-11`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm((value) => !value)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </InputField>

                      {confirmValue && !errors.confirmPassword && confirmValue === passwordValue && (
                        <p className="flex items-center gap-1.5 text-xs text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Passwords match
                        </p>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </button>
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="company"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <InputField id="organizationName" label="Company name" icon={<Building className="h-4 w-4" />} error={errors.organizationName?.message} required>
                          <input
                            id="organizationName"
                            type="text"
                            placeholder="Acme"
                            {...register("organizationName", { required: "Company name is required" })}
                            className={inputCls(!!errors.organizationName)}
                          />
                        </InputField>
                        <InputField id="organizationWebsite" label="Website" icon={<Globe className="h-4 w-4" />}>
                          <input id="organizationWebsite" type="url" placeholder="https://acme.com" {...register("organizationWebsite")} className={inputCls(false)} />
                        </InputField>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <InputField id="organizationEmail" label="Company email" icon={<Mail className="h-4 w-4" />}>
                          <input id="organizationEmail" type="email" placeholder="team@acme.com" {...register("organizationEmail")} className={inputCls(false)} />
                        </InputField>
                        <InputField id="organizationPhone" label="Phone" icon={<Phone className="h-4 w-4" />}>
                          <input id="organizationPhone" type="tel" placeholder="+1 555 000 0000" {...register("organizationPhone")} className={inputCls(false)} />
                        </InputField>
                      </div>

                      <InputField id="organizationAddress" label="Street address" icon={<MapPin className="h-4 w-4" />}>
                        <input id="organizationAddress" type="text" placeholder="123 Market Street" {...register("organizationAddress")} className={inputCls(false)} />
                      </InputField>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <input type="text" placeholder="City" {...register("organizationCity")} className={inputCls(false, false)} />
                        <input type="text" placeholder="State" {...register("organizationState")} className={inputCls(false, false)} />
                        <input type="text" placeholder="ZIP" {...register("organizationZip")} className={inputCls(false, false)} />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-[0.58fr_0.42fr]">
                        <input type="text" placeholder="Country" {...register("organizationCountry")} className={inputCls(false, false)} />
                        <textarea
                          rows={1}
                          placeholder="Description"
                          {...register("organizationDescription")}
                          className={`${inputCls(false, false)} resize-none`}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </button>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              Create account
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {step === 0 && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-slate-500">Or sign up with</span>
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
                </>
              )}

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-emerald-700 hover:text-emerald-800">
                  Sign in
                </Link>
              </p>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                By creating an account, you agree to the workspace terms and privacy policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
