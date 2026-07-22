"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Loader2,
    Download,
    Check,
    Clock,
    Mail,
    User,
    Link as LinkIcon,
    ArrowUpRight,
    Search,
    AlertCircle,
    CheckCircle2,
    Copy,
    RefreshCcw,
    TrendingUp,
    ShieldCheck,
    Wand2,
    MessageSquareText,
    XCircle,
    Send,
    Settings2,
    Webhook,
    Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
    dismissRecoveryLead,
    generateRecoveryMessage,
    getRecoveryCampaign,
    getRecoveryCampaignHealth,
    getRecoveryDeliveryLogs,
    getRecoveryStats,
    getRecoverableLeads,
    markRecoveryLeadContacted,
    optOutRecoveryLead,
    recoverLead,
    getResumeLink,
    sendRecoveryEmail,
    testRecoveryCampaignEmail,
    testRecoveryCampaignWebhook,
    updateRecoveryCampaign,
    type RecoveryCampaignSettings,
    type RecoveryDeliveryHealth,
    type RecoveryDeliveryLog,
    type RecoveryMessageChannel,
    type RecoveryMessageTone,
} from "@/lib/api/organizations";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecoveryStats {
    abandonedCount: number;
    recoveredCount: number;
    recoverableValue: number;
}

interface RecoverableLead {
    _id: string;
    sessionId: string;
    formId: string;
    leadEmail: string;
    leadName?: string;
    progress: number;
    lastActivityAt: string;
    isRecovered: boolean;
    recoveryStatus?: "new" | "message_generated" | "contacted" | "recovered" | "dismissed" | "opted_out";
    contactedCount?: number;
    lastContactedAt?: string;
    lastRecoveryChannel?: RecoveryMessageChannel;
    lastRecoveryTone?: RecoveryMessageTone;
    lastRecoverySubject?: string;
    lastRecoveryMessage?: string;
    lastRecoveryGeneratedAt?: string;
    recoveryValue: number;
    answers: any[];
    answerSummary?: Array<{ fieldId?: string; label: string; value: string }>;
    lastAnsweredQuestion?: string | null;
    leadCompany?: string;
    resumeUrl?: string | null;
    recoveryCampaignAttemptCount?: number;
    nextRecoveryAt?: string | null;
    lastRecoverySentAt?: string | null;
    recoveryEmailStatus?: "idle" | "scheduled" | "processing" | "sent" | "failed" | "skipped";
    recoveryLastError?: string | null;
}

interface GeneratedRecoveryMessage {
    subject?: string;
    message: string;
    resumeUrl: string;
    channel: RecoveryMessageChannel;
    tone: RecoveryMessageTone;
    generatedAt: string;
}

interface RecoveryPanelProps {
    orgId: string;
    formId: string;
    formTitle: string;
}

type RecoveryStatusFilter = "active" | "new" | "message_generated" | "contacted" | "recovered" | "dismissed" | "opted_out" | "all";

const STATUS_FILTERS: Array<{ id: RecoveryStatusFilter; label: string }> = [
    { id: "active", label: "Active" },
    { id: "new", label: "New" },
    { id: "message_generated", label: "Drafted" },
    { id: "contacted", label: "Contacted" },
    { id: "recovered", label: "Recovered" },
    { id: "dismissed", label: "Dismissed" },
    { id: "opted_out", label: "Opted Out" },
    { id: "all", label: "All" },
];

const CHANNEL_OPTIONS: Array<{ value: RecoveryMessageChannel; label: string }> = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "dm", label: "DM" },
];

const TONE_OPTIONS: Array<{ value: RecoveryMessageTone; label: string }> = [
    { value: "friendly", label: "Friendly" },
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "urgent", label: "Urgent" },
];

const DEFAULT_CAMPAIGN: RecoveryCampaignSettings = {
    enabled: false,
    senderMode: "user",
    maxAttempts: 3,
    attemptDelaysHours: [24, 72],
    tone: "friendly",
    sendEmail: true,
    sendWebhook: false,
};

// ─── Helper Components ────────────────────────────────────────────────────────

function KPICard({ 
    label, 
    value, 
    icon: Icon, 
    color = "brand-purple",
    prefix = "" 
}: { 
    label: string; 
    value: string | number; 
    icon: React.ElementType;
    color?: string;
    prefix?: string;
}) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111116] border border-gray-800/60 rounded-2xl p-5 relative overflow-hidden group hover:border-gray-700 transition-colors"
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}/10 rounded-full blur-2xl group-hover:bg-${color}/20 transition-colors`} />
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-lg bg-${color}/10 border border-${color}/20 text-${color}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{label}</p>
                </div>
                <div className="flex items-baseline gap-1">
                    {prefix && <span className="text-sm font-bold text-gray-500">{prefix}</span>}
                    <p className="text-3xl font-black text-white tracking-tight">{value}</p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function RecoveryPanel({ orgId, formId, formTitle }: RecoveryPanelProps) {
    const [stats, setStats] = useState<RecoveryStats | null>(null);
    const [leads, setLeads] = useState<RecoverableLead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<RecoveryStatusFilter>("active");
    const [channel, setChannel] = useState<RecoveryMessageChannel>("email");
    const [tone, setTone] = useState<RecoveryMessageTone>("friendly");
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
    const [sendingId, setSendingId] = useState<string | null>(null);
    const [generatedMessages, setGeneratedMessages] = useState<Record<string, GeneratedRecoveryMessage>>({});
    const [campaign, setCampaign] = useState<RecoveryCampaignSettings>(DEFAULT_CAMPAIGN);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [campaignSaving, setCampaignSaving] = useState(false);
    const [campaignTesting, setCampaignTesting] = useState<"email" | "webhook" | null>(null);
    const [campaignNotice, setCampaignNotice] = useState<string | null>(null);
    const [deliveryHealth, setDeliveryHealth] = useState<RecoveryDeliveryHealth | null>(null);
    const [deliveryLogs, setDeliveryLogs] = useState<RecoveryDeliveryLog[]>([]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [s, l, c, h, logs] = await Promise.all([
                getRecoveryStats(orgId, formId),
                getRecoverableLeads(orgId, formId),
                getRecoveryCampaign(orgId, formId),
                getRecoveryCampaignHealth(orgId, formId),
                getRecoveryDeliveryLogs(orgId, formId),
            ]);
            setStats(s);
            setLeads(l);
            setCampaign({ ...DEFAULT_CAMPAIGN, ...(c.settings || {}) });
            setGoogleConnected(Boolean(c.googleConnected));
            setDeliveryHealth(h);
            setDeliveryLogs(logs);
        } catch (error) {
            console.error("Failed to load recovery data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [orgId, formId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleToggleRecovered = async (lead: RecoverableLead) => {
        try {
            await recoverLead(orgId, formId, lead._id, !lead.isRecovered);
            setLeads(prev => prev.map(l => 
                l._id === lead._id ? {
                    ...l,
                    isRecovered: !l.isRecovered,
                    recoveryStatus: !l.isRecovered ? "recovered" : "new",
                } : l
            ));
            // Refresh stats to update recoveredCount
            const newStats = await getRecoveryStats(orgId, formId);
            setStats(newStats);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCopyResumeLink = async (lead: RecoverableLead) => {
        try {
            const resumeUrl = lead.resumeUrl || (await getResumeLink(orgId, formId, lead.sessionId)).resumeUrl;
            await navigator.clipboard.writeText(resumeUrl);
            setCopiedId(lead._id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerateMessage = async (lead: RecoverableLead) => {
        setActiveLeadId(lead._id);
        setGeneratingId(lead._id);
        try {
            const draft = await generateRecoveryMessage(orgId, formId, lead._id, { channel, tone });
            setGeneratedMessages(prev => ({ ...prev, [lead._id]: draft }));
            setLeads(prev => prev.map(l => l._id === lead._id ? {
                ...l,
                recoveryStatus: l.recoveryStatus === "contacted" || l.recoveryStatus === "recovered" || l.recoveryStatus === "dismissed" ? l.recoveryStatus : "message_generated",
                lastRecoveryChannel: draft.channel,
                lastRecoveryTone: draft.tone,
                lastRecoverySubject: draft.subject,
                lastRecoveryMessage: draft.message,
                lastRecoveryGeneratedAt: draft.generatedAt,
                resumeUrl: draft.resumeUrl,
            } : l));
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingId(null);
        }
    };

    const getLeadDraft = (lead: RecoverableLead): GeneratedRecoveryMessage | null => {
        if (generatedMessages[lead._id]) return generatedMessages[lead._id];
        if (!lead.lastRecoveryMessage) return null;
        return {
            subject: lead.lastRecoverySubject,
            message: lead.lastRecoveryMessage,
            resumeUrl: lead.resumeUrl || "",
            channel: lead.lastRecoveryChannel || "email",
            tone: lead.lastRecoveryTone || "friendly",
            generatedAt: lead.lastRecoveryGeneratedAt || lead.lastActivityAt,
        };
    };

    const handleCopyMessage = async (lead: RecoverableLead) => {
        const draft = getLeadDraft(lead);
        if (!draft) return;
        const content = draft.subject ? `Subject: ${draft.subject}\n\n${draft.message}` : draft.message;
        await navigator.clipboard.writeText(content);
        setCopiedMessageId(lead._id);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const handleMarkContacted = async (lead: RecoverableLead) => {
        const draft = getLeadDraft(lead);
        setStatusUpdatingId(lead._id);
        try {
            await markRecoveryLeadContacted(orgId, formId, lead._id, {
                channel: draft?.channel || channel,
                subject: draft?.subject,
                message: draft?.message,
            });
            setLeads(prev => prev.map(l => l._id === lead._id ? {
                ...l,
                recoveryStatus: "contacted",
                contactedCount: (l.contactedCount || 0) + 1,
                lastContactedAt: new Date().toISOString(),
            } : l));
        } catch (err) {
            console.error(err);
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const handleDismiss = async (lead: RecoverableLead) => {
        setStatusUpdatingId(lead._id);
        try {
            await dismissRecoveryLead(orgId, formId, lead._id);
            setLeads(prev => prev.map(l => l._id === lead._id ? {
                ...l,
                recoveryStatus: "dismissed",
            } : l));
        } catch (err) {
            console.error(err);
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const handleSaveCampaign = async () => {
        setCampaignSaving(true);
        setCampaignNotice(null);
        try {
            const saved = await updateRecoveryCampaign(orgId, formId, campaign);
            setCampaign({ ...DEFAULT_CAMPAIGN, ...(saved.settings || {}) });
            setGoogleConnected(Boolean(saved.googleConnected));
            setCampaignNotice(
                typeof saved.scheduledCount === "number" && saved.scheduledCount > 0
                    ? `Campaign settings saved. ${saved.scheduledCount} abandoned leads queued.`
                    : "Campaign settings saved."
            );
            const [health, logs] = await Promise.all([
                getRecoveryCampaignHealth(orgId, formId),
                getRecoveryDeliveryLogs(orgId, formId),
            ]);
            setDeliveryHealth(health);
            setDeliveryLogs(logs);
        } catch (err: any) {
            setCampaignNotice(err?.message || "Failed to save campaign.");
        } finally {
            setCampaignSaving(false);
        }
    };

    const handleTestEmail = async () => {
        setCampaignTesting("email");
        setCampaignNotice(null);
        try {
            await testRecoveryCampaignEmail(orgId, formId, campaign.senderEmail);
            setCampaignNotice("Test email sent.");
            setDeliveryHealth(await getRecoveryCampaignHealth(orgId, formId));
        } catch (err: any) {
            setCampaignNotice(err?.message || "Failed to send test email.");
        } finally {
            setCampaignTesting(null);
        }
    };

    const handleTestWebhook = async () => {
        setCampaignTesting("webhook");
        setCampaignNotice(null);
        try {
            const result = await testRecoveryCampaignWebhook(orgId, formId, campaign.webhookUrl);
            setCampaignNotice(result.success ? "Webhook test delivered." : result.errorMessage || "Webhook test failed.");
            const [health, logs] = await Promise.all([
                getRecoveryCampaignHealth(orgId, formId),
                getRecoveryDeliveryLogs(orgId, formId),
            ]);
            setDeliveryHealth(health);
            setDeliveryLogs(logs);
        } catch (err: any) {
            setCampaignNotice(err?.message || "Failed to test webhook.");
        } finally {
            setCampaignTesting(null);
        }
    };

    const handleSendEmail = async (lead: RecoverableLead) => {
        setSendingId(lead._id);
        try {
            const result = await sendRecoveryEmail(orgId, formId, lead._id);
            if (result.message) {
                setGeneratedMessages(prev => ({
                    ...prev,
                    [lead._id]: {
                        subject: result.subject,
                        message: result.message,
                        resumeUrl: result.resumeUrl,
                        channel: "email",
                        tone: campaign.tone,
                        generatedAt: new Date().toISOString(),
                    },
                }));
            }
            setLeads(prev => prev.map(l => l._id === lead._id ? {
                ...l,
                recoveryStatus: "contacted",
                contactedCount: (l.contactedCount || 0) + 1,
                recoveryCampaignAttemptCount: (l.recoveryCampaignAttemptCount || 0) + 1,
                recoveryEmailStatus: "sent",
                lastContactedAt: new Date().toISOString(),
                lastRecoverySentAt: new Date().toISOString(),
                recoveryLastError: null,
            } : l));
            const [health, logs] = await Promise.all([
                getRecoveryCampaignHealth(orgId, formId),
                getRecoveryDeliveryLogs(orgId, formId),
            ]);
            setDeliveryHealth(health);
            setDeliveryLogs(logs);
        } catch (err) {
            console.error(err);
        } finally {
            setSendingId(null);
        }
    };

    const handleOptOut = async (lead: RecoverableLead) => {
        setStatusUpdatingId(lead._id);
        try {
            await optOutRecoveryLead(orgId, formId, lead._id);
            setLeads(prev => prev.map(l => l._id === lead._id ? {
                ...l,
                recoveryStatus: "opted_out",
                recoveryEmailStatus: "skipped",
                recoveryLastError: "Lead opted out of recovery",
                nextRecoveryAt: null,
            } : l));
            const [health, logs] = await Promise.all([
                getRecoveryCampaignHealth(orgId, formId),
                getRecoveryDeliveryLogs(orgId, formId),
            ]);
            setDeliveryHealth(health);
            setDeliveryLogs(logs);
        } catch (err) {
            console.error(err);
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const handleExportCSV = () => {
        const headers = ["Email", "Name", "Progress", "Status", "Contacted Count", "Last Activity", "Recovered", "Potential Value"];
        const rows = leads.map(l => [
            l.leadEmail,
            l.leadName || "",
            `${l.progress}%`,
            l.recoveryStatus || "new",
            l.contactedCount || 0,
            new Date(l.lastActivityAt).toLocaleString(),
            l.isRecovered ? "Yes" : "No",
            l.recoveryValue || 0,
        ]);
        
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `recoverable-leads-${formTitle}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatus = (lead: RecoverableLead) => lead.isRecovered ? "recovered" : (lead.recoveryStatus || "new");

    const filteredLeads = leads.filter(l => {
        const matchesSearch =
            l.leadEmail.toLowerCase().includes(search.toLowerCase()) ||
            (l.leadName && l.leadName.toLowerCase().includes(search.toLowerCase())) ||
            (l.leadCompany && l.leadCompany.toLowerCase().includes(search.toLowerCase()));
        const status = getStatus(l);
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && status !== "dismissed" && status !== "recovered" && status !== "opted_out") ||
            status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = leads.reduce<Record<string, number>>((acc, lead) => {
        const status = getStatus(lead);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const statusStyles: Record<string, string> = {
        new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        message_generated: "bg-brand-purple/10 text-brand-purple border-brand-purple/20",
        contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        recovered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        dismissed: "bg-gray-800 text-gray-500 border-gray-700",
        opted_out: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };

    const statusLabel: Record<string, string> = {
        new: "New",
        message_generated: "Drafted",
        contacted: "Contacted",
        recovered: "Recovered",
        dismissed: "Dismissed",
        opted_out: "Opted Out",
    };

    const logsByLead = deliveryLogs.reduce<Record<string, RecoveryDeliveryLog[]>>((acc, log) => {
        if (!log.submissionId) return acc;
        const key = String(log.submissionId);
        acc[key] = acc[key] || [];
        acc[key].push(log);
        return acc;
    }, {});

    const deliveryStatusStyles: Record<string, string> = {
        pending: "text-gray-500",
        retrying: "text-amber-400",
        sent: "text-emerald-400",
        failed: "text-rose-400",
        skipped: "text-gray-600",
    };

    const formatDeliveryEvent = (event: string) =>
        event
            .replace(/^recovery\./, "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

    return (
        <div className="space-y-8 pb-20">
            {/* Header / ROI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard 
                    label="Potential Revenue" 
                    value={stats?.recoverableValue.toLocaleString() || "0"} 
                    icon={TrendingUp} 
                    color="emerald-500"
                    prefix="$"
                />
                <KPICard 
                    label="Abandoned Leads" 
                    value={stats?.abandonedCount || 0} 
                    icon={Clock} 
                    color="brand-purple"
                />
                <KPICard 
                    label="Successfully Recovered" 
                    value={stats?.recoveredCount || 0} 
                    icon={CheckCircle2} 
                    color="blue-500"
                />
            </div>

            <div className="bg-[#0b0b0f] border border-gray-800/80 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#111116]/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                            <Settings2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm text-white font-black tracking-tight">Automatic Recovery Campaign</h3>
                            <p className="text-xs text-gray-600 font-medium">Google email sending with webhook push for abandoned leads.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase ${googleConnected ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-amber-500/20 bg-amber-500/10 text-amber-400"}`}>
                            {googleConnected ? "Google Connected" : "Google Needed"}
                        </span>
                        <button
                            onClick={() => setCampaign(prev => ({ ...prev, enabled: !prev.enabled }))}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${campaign.enabled ? "bg-emerald-500 text-black" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}
                        >
                            {campaign.enabled ? "Enabled" : "Disabled"}
                        </button>
                    </div>
                </div>
                <div className="p-5 grid grid-cols-1 xl:grid-cols-[1fr_1fr_280px] gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sender</span>
                            <select
                                value={campaign.senderMode}
                                onChange={e => setCampaign(prev => ({ ...prev, senderMode: e.target.value as "user" | "organization" }))}
                                className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                            >
                                <option value="user">Connected user mailbox</option>
                                <option value="organization">Organization sender address</option>
                            </select>
                        </label>
                        <label className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sender / Test Email</span>
                            <input
                                value={campaign.senderEmail || ""}
                                onChange={e => setCampaign(prev => ({ ...prev, senderEmail: e.target.value }))}
                                placeholder="name@company.com"
                                className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-purple/40"
                            />
                        </label>
                        <label className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Tone</span>
                            <select
                                value={campaign.tone}
                                onChange={e => setCampaign(prev => ({ ...prev, tone: e.target.value as RecoveryMessageTone }))}
                                className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                            >
                                {TONE_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                        <label className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Max Attempts</span>
                            <input
                                type="number"
                                min={1}
                                max={3}
                                value={campaign.maxAttempts}
                                onChange={e => setCampaign(prev => ({ ...prev, maxAttempts: Number(e.target.value) }))}
                                className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                            />
                        </label>
                    </div>

                    <div className="space-y-3">
                        <label className="space-y-1 block">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Webhook URL</span>
                            <input
                                value={campaign.webhookUrl || ""}
                                onChange={e => setCampaign(prev => ({ ...prev, webhookUrl: e.target.value, sendWebhook: Boolean(e.target.value.trim()) }))}
                                placeholder="https://hooks.zapier.com/..."
                                className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-purple/40"
                            />
                        </label>
                        <label className="space-y-1 block">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Webhook Secret</span>
                            <input
                                value={campaign.webhookSecret || ""}
                                onChange={e => setCampaign(prev => ({ ...prev, webhookSecret: e.target.value }))}
                                placeholder="Optional HMAC secret"
                                className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-purple/40"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#111116]/60 px-3 py-2.5">
                                <input
                                    type="checkbox"
                                    checked={campaign.sendEmail}
                                    onChange={e => setCampaign(prev => ({ ...prev, sendEmail: e.target.checked }))}
                                />
                                <span className="text-xs text-gray-300 font-bold">Send email</span>
                            </label>
                            <label className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#111116]/60 px-3 py-2.5">
                                <input
                                    type="checkbox"
                                    checked={campaign.sendWebhook}
                                    onChange={e => setCampaign(prev => ({ ...prev, sendWebhook: e.target.checked }))}
                                />
                                <span className="text-xs text-gray-300 font-bold">Push webhook</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleSaveCampaign}
                            disabled={campaignSaving}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-tight hover:bg-gray-200 transition-all disabled:opacity-50"
                        >
                            {campaignSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Save Campaign
                        </button>
                        <button
                            onClick={handleTestEmail}
                            disabled={campaignTesting === "email"}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs font-black uppercase tracking-tight hover:text-white transition-all disabled:opacity-50"
                        >
                            {campaignTesting === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Test Email
                        </button>
                        <button
                            onClick={handleTestWebhook}
                            disabled={campaignTesting === "webhook" || !campaign.webhookUrl}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs font-black uppercase tracking-tight hover:text-white transition-all disabled:opacity-50"
                        >
                            {campaignTesting === "webhook" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Webhook className="w-4 h-4" />}
                            Test Webhook
                        </button>
                        {campaignNotice && (
                            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">{campaignNotice}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-[#0b0b0f] border border-gray-800/80 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800/80 flex items-center justify-between gap-4 bg-[#111116]/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm text-white font-black tracking-tight">Delivery Health</h3>
                            <p className="text-xs text-gray-600 font-medium">
                                Worker {deliveryHealth?.workerMode?.replace("_", " ") || "database polling"}
                                {deliveryHealth?.lastRunAt ? ` / last run ${formatDistanceToNow(new Date(deliveryHealth.lastRunAt))} ago` : ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-500 hover:text-white hover:border-gray-700 transition-all"
                        title="Refresh recovery delivery health"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-px bg-gray-800/60">
                    {[
                        ["Scheduled", deliveryHealth?.scheduledCount || 0, "text-blue-400"],
                        ["Due", deliveryHealth?.dueCount || 0, "text-amber-400"],
                        ["Processing", deliveryHealth?.processingCount || 0, "text-brand-purple"],
                        ["Sent 24h", deliveryHealth?.sentLast24h || 0, "text-emerald-400"],
                        ["Failed 24h", deliveryHealth?.failedLast24h || 0, "text-rose-400"],
                        ["Webhook Failed", deliveryHealth?.webhookFailedLast24h || 0, "text-rose-300"],
                        ["Opted Out", deliveryHealth?.optedOutCount || 0, "text-gray-500"],
                    ].map(([label, value, color]) => (
                        <div key={String(label)} className="bg-[#0b0b0f] p-4">
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{label}</p>
                            <p className={`text-xl font-black mt-1 ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Table Area */}
            <div className="bg-[#0b0b0f] border border-gray-800/80 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800/80 flex items-center justify-between gap-4 bg-[#111116]/30">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input 
                                type="text"
                                placeholder="Search leads by email or name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-black/40 border border-gray-800 rounded-xl px-10 py-2.5 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-purple/40 transition-all font-medium"
                            />
                        </div>
                        <div className="hidden xl:flex items-center gap-1.5">
                            {STATUS_FILTERS.map(({ id, label }) => {
                                const count =
                                    id === "active"
                                        ? leads.filter(l => getStatus(l) !== "dismissed" && getStatus(l) !== "recovered" && getStatus(l) !== "opted_out").length
                                        : id === "all"
                                            ? leads.length
                                            : statusCounts[id] || 0;
                                return (
                                <button
                                    key={id}
                                    onClick={() => setStatusFilter(id)}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-tight transition-all ${
                                        statusFilter === id
                                            ? "border-brand-purple/50 text-white bg-brand-purple/10"
                                            : "border-gray-800 text-gray-600 hover:text-gray-300 hover:border-gray-700"
                                    }`}
                                >
                                    {label} <span className="text-gray-600 ml-1">{count}</span>
                                </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={loadData}
                            className="p-2.5 rounded-xl border border-gray-800 text-gray-500 hover:text-white hover:bg-gray-800/50 transition-all"
                        >
                            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button 
                            onClick={handleExportCSV}
                            disabled={leads.length === 0}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-tight hover:bg-gray-200 transition-all disabled:opacity-40"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800/50">
                                <th className="px-6 py-4 text-[10px] text-gray-500 font-black uppercase tracking-widest">Lead Information</th>
                                <th className="px-6 py-4 text-[10px] text-gray-500 font-black uppercase tracking-widest text-center">Progress</th>
                                <th className="px-6 py-4 text-[10px] text-gray-500 font-black uppercase tracking-widest">Last Activity</th>
                                <th className="px-6 py-4 text-[10px] text-gray-500 font-black uppercase tracking-widest">Potential Value</th>
                                <th className="px-6 py-4 text-[10px] text-gray-500 font-black uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/30">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-brand-purple mx-auto" />
                                            <p className="text-xs text-gray-600 mt-2 font-medium">Crunching lead data...</p>
                                        </td>
                                    </tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <AlertCircle className="w-8 h-8 text-gray-800 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500 font-medium">No recoverable leads found{search ? ' matching your search' : ''}.</p>
                                            <p className="text-xs text-gray-700 mt-1 uppercase font-black tracking-widest">Nice work! Everyone is finishing your form.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead, idx) => {
                                        const status = getStatus(lead);
                                        const draft = getLeadDraft(lead);
                                        const isComposerOpen = activeLeadId === lead._id;
                                        const leadLogs = logsByLead[lead._id] || [];

                                        return (
                                            <React.Fragment key={lead._id}>
                                        <motion.tr 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                                                        {lead.leadName ? (
                                                            <span className="text-sm font-black tracking-tighter uppercase">{lead.leadName[0]}</span>
                                                        ) : (
                                                            <User className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-xs text-white font-bold">{lead.leadEmail}</span>
                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter border ${statusStyles[status] || statusStyles.new}`}>
                                                                {statusLabel[status] || "New"}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-600 font-medium mt-0.5">
                                                            {lead.leadName ? `${lead.leadName} / ` : ""}
                                                            {lead.leadCompany ? `${lead.leadCompany} / ` : ""}
                                                            Session {lead.sessionId.slice(0, 8)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="max-w-[100px] mx-auto">
                                                    <div className="flex justify-between text-[10px] text-gray-600 mb-1 font-bold">
                                                        <span>{lead.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${lead.progress}%` }}
                                                            className={`h-full rounded-full ${lead.progress > 70 ? 'bg-emerald-500' : 'bg-brand-purple'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                        <Clock className="w-3.5 h-3.5 text-gray-600" />
                                                        {formatDistanceToNow(new Date(lead.lastActivityAt))} ago
                                                    </div>
                                                    {lead.contactedCount ? (
                                                        <p className="text-[10px] text-gray-600 font-bold uppercase">
                                                            Contacted {lead.contactedCount}x
                                                        </p>
                                                    ) : null}
                                                    {lead.recoveryEmailStatus && lead.recoveryEmailStatus !== "idle" ? (
                                                        <p className={`text-[10px] font-bold uppercase ${
                                                            lead.recoveryEmailStatus === "failed" ? "text-rose-400" :
                                                            lead.recoveryEmailStatus === "sent" ? "text-emerald-400" :
                                                            lead.recoveryEmailStatus === "processing" ? "text-brand-purple" :
                                                            "text-gray-600"
                                                        }`}>
                                                            Email {lead.recoveryEmailStatus}
                                                        </p>
                                                    ) : null}
                                                    {lead.nextRecoveryAt ? (
                                                        <p className="text-[10px] text-blue-400/80 font-bold uppercase">
                                                            Next {formatDistanceToNow(new Date(lead.nextRecoveryAt), { addSuffix: true })}
                                                        </p>
                                                    ) : null}
                                                    {lead.recoveryLastError ? (
                                                        <p className="max-w-[180px] truncate text-[10px] text-rose-400/80 font-semibold" title={lead.recoveryLastError}>
                                                            {lead.recoveryLastError}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs text-emerald-400/80 font-black font-mono">
                                                    ${lead.recoveryValue || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setActiveLeadId(isComposerOpen ? null : lead._id)}
                                                        className={`p-2 rounded-lg border transition-all ${isComposerOpen ? "bg-brand-purple/10 border-brand-purple/30 text-brand-purple" : "bg-gray-900 border-gray-800 text-gray-500 hover:text-white hover:border-gray-700"}`}
                                                        title="Open recovery composer"
                                                    >
                                                        <MessageSquareText className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCopyResumeLink(lead)}
                                                        className={`p-2 rounded-lg transition-all ${copiedId === lead._id ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-900 border border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'}`}
                                                        title="Copy resume link"
                                                    >
                                                        {copiedId === lead._id ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleToggleRecovered(lead)}
                                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${lead.isRecovered ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20'}`}
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        {lead.isRecovered ? 'Recovered' : 'Mark Recovered'}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>

                                        {isComposerOpen && (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-[#07070a]"
                                            >
                                                <td colSpan={5} className="px-6 pb-6">
                                                    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5 border border-gray-800/70 rounded-2xl p-4 bg-black/30">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Lead Context</p>
                                                                <div className="space-y-2">
                                                                    {(lead.answerSummary || []).slice(0, 4).map(answer => (
                                                                        <div key={`${lead._id}-${answer.fieldId || answer.label}`} className="rounded-xl border border-gray-800/70 bg-[#111116]/60 p-3">
                                                                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-tight truncate">{answer.label}</p>
                                                                            <p className="text-xs text-gray-300 font-semibold mt-1 line-clamp-2">{answer.value}</p>
                                                                        </div>
                                                                    ))}
                                                                    {(lead.answerSummary || []).length === 0 && (
                                                                        <p className="text-xs text-gray-600 font-medium">No saved answers yet.</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Delivery Timeline</p>
                                                                <div className="space-y-2">
                                                                    {leadLogs.slice(0, 5).map(log => (
                                                                        <div key={log._id} className="rounded-xl border border-gray-800/70 bg-[#111116]/60 p-3">
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">
                                                                                    {formatDeliveryEvent(log.event)}
                                                                                </p>
                                                                                <span className={`text-[10px] font-black uppercase ${deliveryStatusStyles[log.status] || "text-gray-500"}`}>
                                                                                    {log.status}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-[10px] text-gray-600 font-semibold mt-1">
                                                                                {log.channel} / attempt {log.attemptCount} / {formatDistanceToNow(new Date(log.createdAt))} ago
                                                                            </p>
                                                                            {log.errorMessage ? (
                                                                                <p className="text-[10px] text-rose-400/80 font-semibold mt-1 line-clamp-2">{log.errorMessage}</p>
                                                                            ) : null}
                                                                            {log.nextRetryAt ? (
                                                                                <p className="text-[10px] text-blue-400/80 font-semibold mt-1">
                                                                                    Retry {formatDistanceToNow(new Date(log.nextRetryAt), { addSuffix: true })}
                                                                                </p>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                    {leadLogs.length === 0 && (
                                                                        <p className="text-xs text-gray-600 font-medium">No delivery attempts yet.</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2">
                                                                <label className="space-y-1">
                                                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Channel</span>
                                                                    <select
                                                                        value={channel}
                                                                        onChange={e => setChannel(e.target.value as RecoveryMessageChannel)}
                                                                        className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                                                                    >
                                                                        {CHANNEL_OPTIONS.map(option => (
                                                                            <option key={option.value} value={option.value}>{option.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </label>
                                                                <label className="space-y-1">
                                                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Tone</span>
                                                                    <select
                                                                        value={tone}
                                                                        onChange={e => setTone(e.target.value as RecoveryMessageTone)}
                                                                        className="w-full bg-[#111116] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                                                                    >
                                                                        {TONE_OPTIONS.map(option => (
                                                                            <option key={option.value} value={option.value}>{option.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </label>
                                                            </div>

                                                            <button
                                                                onClick={() => handleGenerateMessage(lead)}
                                                                disabled={generatingId === lead._id}
                                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-black uppercase tracking-tight hover:bg-brand-purple/90 transition-all disabled:opacity-50"
                                                            >
                                                                {generatingId === lead._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                                                {draft ? "Regenerate Draft" : "Generate Draft"}
                                                            </button>
                                                        </div>

                                                        <div className="min-h-[260px] rounded-2xl border border-gray-800/70 bg-[#111116]/50 p-4 flex flex-col">
                                                            {draft ? (
                                                                <>
                                                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                                                        <div>
                                                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Recovery Draft</p>
                                                                            <p className="text-[10px] text-gray-700 font-bold mt-1 uppercase">
                                                                                {draft.channel} / {draft.tone} / {formatDistanceToNow(new Date(draft.generatedAt))} ago
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleCopyMessage(lead)}
                                                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${copiedMessageId === lead._id ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}
                                                                        >
                                                                            {copiedMessageId === lead._id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                                            {copiedMessageId === lead._id ? "Copied" : "Copy"}
                                                                        </button>
                                                                    </div>
                                                                    {draft.subject && (
                                                                        <div className="mb-3 rounded-xl border border-gray-800 bg-black/30 p-3">
                                                                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-tight">Subject</p>
                                                                            <p className="text-sm text-white font-bold mt-1">{draft.subject}</p>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 rounded-xl border border-gray-800 bg-black/30 p-3">
                                                                        <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{draft.message}</p>
                                                                    </div>
                                                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                                        <button
                                                                            onClick={() => handleSendEmail(lead)}
                                                                            disabled={sendingId === lead._id}
                                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-tight hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                                                                        >
                                                                            {sendingId === lead._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                                                            Send Email
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleMarkContacted(lead)}
                                                                            disabled={statusUpdatingId === lead._id}
                                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-tight hover:bg-amber-500/20 transition-all disabled:opacity-50"
                                                                        >
                                                                            {statusUpdatingId === lead._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                                                                            Mark Contacted
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDismiss(lead)}
                                                                            disabled={statusUpdatingId === lead._id}
                                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-tight hover:text-rose-400 hover:border-rose-500/30 transition-all disabled:opacity-50"
                                                                        >
                                                                            <XCircle className="w-3.5 h-3.5" />
                                                                            Dismiss
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleOptOut(lead)}
                                                                            disabled={statusUpdatingId === lead._id}
                                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-tight hover:text-rose-300 hover:border-rose-500/30 transition-all disabled:opacity-50"
                                                                        >
                                                                            <ShieldCheck className="w-3.5 h-3.5" />
                                                                            Stop Recovery
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-1 flex-col items-center justify-center text-center">
                                                                    <Wand2 className="w-6 h-6 text-gray-700 mb-3" />
                                                                    <p className="text-sm text-gray-400 font-bold">No draft yet</p>
                                                                    <p className="text-xs text-gray-600 mt-1 max-w-sm">
                                                                        Generate a message, then copy it into your email, SMS, WhatsApp, or DM tool.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                
                {leads.length > 0 && (
                    <div className="p-5 bg-black/40 border-t border-gray-800/80">
                        <div className="flex items-center gap-2 text-rose-400/60">
                            <ShieldCheck className="w-4 h-4" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">GDRP / Consent Compliant: Data is stored for recovery purposes only.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
