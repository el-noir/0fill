import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Calendar, AlertCircle, ExternalLink, Download, Check } from "lucide-react";

interface Answer {
    label: string;
    value: any;
    entryId?: string;
}

interface Response {
    id: string;
    sessionId: string;
    status: string;
    answers: Answer[];
    submittedAt?: string;
    lastActivityAt?: string;
    leadEmail?: string;
    leadName?: string;
    progress?: number;
    error?: string;
    confirmationUrl?: string;
}

interface ResponsesListProps {
    responses: Response[];
    loading: boolean;
    formTitle?: string;
}

// Build and trigger a CSV download from responses
function exportToCSV(responses: Response[], formTitle: string) {
    if (responses.length === 0) return;

    // Collect all unique answer labels as column headers
    const labelSet = new Set<string>();
    responses.forEach((r) => r.answers?.forEach((a) => labelSet.add(a.label)));
    const labels = Array.from(labelSet);

    const headers = ["Session ID", "Status", "Lead Name", "Lead Email", "Progress (%)", "Last Activity", "Submitted At", ...labels];

    const escapeCsvCell = (value: any): string => {
        const str = Array.isArray(value) ? value.join("; ") : String(value ?? "");
        // Wrap in quotes if it contains comma, newline, or quote
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const rows = responses.map((r) => {
        const answerMap: Record<string, any> = {};
        r.answers?.forEach((a) => { answerMap[a.label] = a.value; });

        return [
            r.sessionId,
            r.status,
            r.leadName ?? "",
            r.leadEmail ?? "",
            r.progress ?? 0,
            r.lastActivityAt ? new Date(r.lastActivityAt).toISOString() : "",
            r.submittedAt ? new Date(r.submittedAt).toISOString() : "",
            ...labels.map((label) => answerMap[label] ?? ""),
        ].map(escapeCsvCell).join(",");
    });

    const csv = [headers.map(escapeCsvCell).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formTitle.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "responses"}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export const ResponsesList: React.FC<ResponsesListProps> = ({ responses, loading, formTitle = "responses" }) => {
    const [exported, setExported] = useState(false);
    const [filter, setFilter] = useState<"ALL" | "SUCCESS" | "PENDING">("ALL");

    const handleExport = () => {
        exportToCSV(responses, formTitle);
        setExported(true);
        setTimeout(() => setExported(false), 2500);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="w-8 h-8 border-2 border-t-brand-purple border-gray-800 rounded-full animate-spin mb-4" />
                <p className="text-sm">Loading responses...</p>
            </div>
        );
    }

    if (responses.length === 0) {
        return (
            <div className="border border-dashed border-gray-800 rounded-xl p-12 text-center bg-black/20">
                <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-1">No responses yet</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    Share your form to start collecting conversational data from your users.
                </p>
            </div>
        );
    }

    const filteredResponses = responses.filter(r => {
        if (filter === "ALL") return true;
        return r.status === filter;
    });

    const successCount = responses.filter((r) => r.status === "SUCCESS").length;
    const partialCount = responses.filter((r) => r.status === "PENDING").length;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-1 bg-[#111116] p-1 rounded-lg border border-gray-800 w-fit">
                    {(["ALL", "SUCCESS", "PENDING"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                filter === f
                                    ? "bg-gray-800 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {f === "ALL" ? "All" : f === "SUCCESS" ? "Completed" : "Partial"}
                            <span className="ml-1.5 opacity-50 font-normal">
                                {f === "ALL" ? responses.length : f === "SUCCESS" ? successCount : partialCount}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <p className="text-xs text-gray-500 hidden md:block">
                        Showing {filteredResponses.length} response{filteredResponses.length !== 1 ? 's' : ''}
                    </p>
                    <button
                        onClick={handleExport}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all ${exported
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-[#111116] border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white"
                            }`}
                    >
                        {exported ? (
                            <><Check className="w-3.5 h-3.5" /> Downloaded</>
                        ) : (
                            <><Download className="w-3.5 h-3.5" /> Export CSV</>
                        )}
                    </button>
                </div>
            </div>

            {/* Response cards */}
            <div className="grid gap-4">
                {filteredResponses.length === 0 ? (
                    <div className="py-12 text-center border border-gray-800 rounded-xl bg-black/10">
                        <p className="text-sm text-gray-500">No {filter === "SUCCESS" ? "completed" : "partial"} responses found.</p>
                    </div>
                ) : (
                    filteredResponses.map((resp) => (
                        <div
                            key={resp.id}
                            className={`bg-[#0f0f14] border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-brand-purple/5 ${
                                resp.status === "PENDING" ? "border-amber-500/20" : "border-gray-800"
                            }`}
                        >
                            {/* Card Header */}
                            <div className="p-4 border-b border-gray-800/50 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        resp.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                    }`}>
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white">
                                                {resp.leadName || resp.leadEmail || `Visitor ${resp.sessionId.split("-")[0]}`}
                                            </p>
                                            {resp.leadName && resp.leadEmail && (
                                                <span className="text-xs text-gray-500">({resp.leadEmail})</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider mt-0.5">
                                            {formatDistanceToNow(new Date(resp.lastActivityAt || resp.submittedAt || Date.now()), { addSuffix: true })}
                                            {resp.status === "PENDING" && " · Active session"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {resp.status === "PENDING" && resp.progress !== undefined && (
                                        <div className="flex flex-col items-end gap-1.5 mr-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-gray-500 tabular-nums font-medium">{resp.progress}%</span>
                                                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-amber-500 transition-all duration-500" 
                                                        style={{ width: `${resp.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${resp.status === "SUCCESS"
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            }`}
                                    >
                                        {resp.status === "SUCCESS" ? "Completed" : "Partial Lead"}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-4">
                                {resp.answers && resp.answers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {resp.answers.map((ans, idx) => (
                                            <div key={idx} className="group pb-3 border-b border-gray-800/30 last:border-0 last:pb-0">
                                                <p className="text-[11px] text-gray-500 mb-1 group-hover:text-gray-400 transition-colors capitalize">
                                                    {ans.label}
                                                </p>
                                                <div className="text-sm text-gray-200">
                                                    {Array.isArray(ans.value) ? (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {ans.value.map((v, i) => (
                                                                <span key={i} className="bg-gray-800 px-1.5 py-0.5 rounded text-[10px]">{v}</span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="break-words">{ans.value || "—"}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-600 italic py-4 text-center">No answers collected yet.</p>
                                )}

                                {resp.error && (
                                    <div className="mt-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-400/80">{resp.error}</p>
                                    </div>
                                )}

                                {(resp.confirmationUrl || resp.status === "SUCCESS") && (
                                    <div className="flex items-center gap-4 pt-2 border-t border-gray-800/50">
                                        {resp.confirmationUrl && (
                                            <a
                                                href={resp.confirmationUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-brand-purple hover:underline"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                View External Confirmation
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
