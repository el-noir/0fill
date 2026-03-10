"use client";

import { TrendingUp, TrendingDown, FileText, Activity, Users, CheckCircle2, Clock, CalendarDays } from "lucide-react";

interface DashboardStats {
    totalForms: number;
    activeForms: number;
    totalSubmissions: number;
    successfulSubmissions: number;
    failedSubmissions: number;
    completionRate: number;
    averageCompletionTimeSeconds: number | null;
    responsesToday: number;
    responsesThisWeek: number;
    responsesThisMonth: number;
    trends: {
        submissions: { current: number; previous: number; changePercent: number | null };
        completionRate: { current: number; previous: number; changePercent: number | null };
        forms: { current: number; previous: number; changePercent: number | null };
    };
}

function formatTime(secs: number | null): string {
    if (secs === null || secs === undefined) return "--";
    if (secs < 60) return `${secs}s`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function TrendBadge({ changePercent }: { changePercent: number | null }) {
    if (changePercent === null || changePercent === undefined) {
        return <span className="text-[10px] text-gray-600 font-medium px-1.5 py-0.5 bg-gray-800/50 rounded">New</span>;
    }
    const isPositive = changePercent > 0;
    const isNegative = changePercent < 0;
    const prefix = isPositive ? "+" : "";
    return (
        <div className={`flex items-center text-xs font-semibold ${isPositive ? "text-emerald-500" : isNegative ? "text-red-500" : "text-gray-500"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1 opacity-70" /> : isNegative ? <TrendingDown className="w-3 h-3 mr-1 opacity-70" /> : null}
            {prefix}{changePercent.toFixed(1)}%
        </div>
    );
}

export function KPICards({ stats, isLoading }: { stats: DashboardStats | null; isLoading: boolean }) {
    const kpis = [
        {
            title: "Total Forms",
            value: stats ? stats.totalForms.toString() : "-",
            trend: stats?.trends.forms.changePercent ?? null,
            icon: FileText,
        },
        {
            title: "Active Forms",
            value: stats ? stats.activeForms.toString() : "-",
            trend: null as number | null, // no trend for this card
            icon: Activity,
        },
        {
            title: "Total Submissions",
            value: stats ? stats.totalSubmissions.toLocaleString() : "-",
            trend: stats?.trends.submissions.changePercent ?? null,
            icon: Users,
        },
        {
            title: "Completion Rate",
            value: stats ? `${stats.completionRate.toFixed(1)}%` : "-",
            trend: stats?.trends.completionRate.changePercent ?? null,
            icon: CheckCircle2,
        },
        {
            title: "Avg. Time",
            value: stats ? formatTime(stats.averageCompletionTimeSeconds) : "-",
            trend: null as number | null,
            icon: Clock,
        },
        {
            title: "Responses Today",
            value: stats ? stats.responsesToday.toString() : "-",
            trend: null as number | null,
            sub: stats ? `${stats.responsesThisWeek} this week · ${stats.responsesThisMonth} this month` : undefined,
            icon: CalendarDays,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-8">
            {kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                    <div key={idx} className="bg-[#0B0B0F] border border-gray-800/80 rounded-md p-5 flex flex-col justify-between hover:border-gray-700 transition-colors shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-sm font-medium">{kpi.title}</span>
                            <Icon className="w-4 h-4 text-gray-600" />
                        </div>

                        <div className="flex items-end justify-between">
                            {isLoading ? (
                                <div className="h-8 w-16 bg-gray-800/50 rounded animate-pulse" />
                            ) : (
                                <h3 className="text-2xl font-semibold text-gray-100 tabular-nums tracking-tight">{kpi.value}</h3>
                            )}

                            {!isLoading && kpi.trend !== null && (
                                <TrendBadge changePercent={kpi.trend} />
                            )}
                        </div>

                        {!isLoading && (kpi as any).sub && (
                            <p className="text-xs text-gray-600 mt-1.5">{(kpi as any).sub}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
