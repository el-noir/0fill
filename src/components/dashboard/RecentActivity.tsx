"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    CheckCircle2,
    Plus,
    Zap,
    AlertCircle,
    Link2,
    Settings,
    UserPlus,
    UserMinus,
    RefreshCw,
    Plug,
    Trash2,
    Loader2,
    Inbox,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getDashboardActivity } from "@/lib/api/organizations";

interface ActivityItem {
    id: string;
    action: string;
    description: string;
    metadata: Record<string, any>;
    userId: string | null;
    createdAt: string;
}

interface ActivityData {
    activities: ActivityItem[];
    total: number;
    page: number;
    totalPages: number;
}

const ACTION_MAP: Record<string, { icon: React.ElementType; color: string }> = {
    SUBMISSION_RECEIVED: { icon: CheckCircle2, color: "text-emerald-500" },
    SUBMISSION_FAILED: { icon: AlertCircle, color: "text-red-500" },
    FORM_IMPORTED: { icon: Plus, color: "text-blue-400" },
    FORM_DELETED: { icon: Trash2, color: "text-gray-500" },
    CHAT_LINK_GENERATED: { icon: Link2, color: "text-blue-400" },
    CHAT_CONFIG_UPDATED: { icon: Settings, color: "text-gray-400" },
    MEMBER_INVITED: { icon: UserPlus, color: "text-blue-400" },
    MEMBER_REMOVED: { icon: UserMinus, color: "text-red-400" },
    MEMBER_ROLE_CHANGED: { icon: RefreshCw, color: "text-yellow-400" },
    INTEGRATION_CONNECTED: { icon: Plug, color: "text-emerald-500" },
    INTEGRATION_DISCONNECTED: { icon: Zap, color: "text-red-400" },
};

const DEFAULT_ICON = { icon: Zap, color: "text-gray-400" };

export function RecentActivity({ orgId }: { orgId: string }) {
    const [data, setData] = useState<ActivityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    // Initial load — 5 items
    useEffect(() => {
        if (!orgId) return;
        setLoading(true);
        getDashboardActivity(orgId, { page: 1, pageSize: 5 })
            .then((d) => { setData(d); setPage(1); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [orgId]);

    const handleViewAll = useCallback(() => {
        if (!orgId) return;
        setExpanded(true);
        setLoadingMore(true);
        getDashboardActivity(orgId, { page: 1, pageSize: 20 })
            .then((d) => { setData(d); setPage(1); })
            .catch(console.error)
            .finally(() => setLoadingMore(false));
    }, [orgId]);

    const handlePage = useCallback((p: number) => {
        if (!orgId) return;
        setLoadingMore(true);
        getDashboardActivity(orgId, { page: p, pageSize: 20 })
            .then((d) => { setData(d); setPage(p); })
            .catch(console.error)
            .finally(() => setLoadingMore(false));
    }, [orgId]);

    const activities = data?.activities ?? [];

    return (
        <div className="bg-[#0B0B0F] border border-gray-800/80 rounded-md p-5 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/50">
                <h3 className="text-gray-200 font-medium text-sm">Recent Activity</h3>
                {!expanded && !loading && activities.length > 0 && (
                    <button
                        onClick={handleViewAll}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        View All
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center py-10 text-gray-500 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                    <span className="text-sm">Loading activity…</span>
                </div>
            ) : activities.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                    <Inbox className="w-5 h-5 text-gray-700 mb-2" />
                    <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
            ) : (
                <>
                    <div className={`flex-1 space-y-6 ${loadingMore ? "opacity-50 pointer-events-none" : ""}`}>
                        {activities.map((activity, idx) => {
                            const config = ACTION_MAP[activity.action] ?? DEFAULT_ICON;
                            const Icon = config.icon;
                            return (
                                <div key={activity.id} className="relative pl-2">
                                    {idx !== activities.length - 1 && (
                                        <div className="absolute top-5 left-[1.15rem] bottom-[-1.5rem] w-px bg-gray-800/60" />
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-0.5 p-1 bg-[#111116] border border-gray-800 rounded-md relative z-10 ${config.color}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-300 truncate">{activity.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination when expanded */}
                    {expanded && data && data.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-800/50">
                            <button
                                onClick={() => handlePage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className="text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Prev
                            </button>
                            <span className="text-xs text-gray-500">
                                Page {page} of {data.totalPages}
                            </span>
                            <button
                                onClick={() => handlePage(Math.min(data.totalPages, page + 1))}
                                disabled={page >= data.totalPages}
                                className="text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
