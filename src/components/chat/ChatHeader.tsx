import React from 'react';
import Image from 'next/image';
import { ProgressDetail } from './types';

interface ChatHeaderProps {
    title?: string;
    aiName?: string;
    chatState: string;
    progress: number;
    progressDetail?: ProgressDetail | null;
    removeBranding?: boolean;
    themeColor?: string;
}

export function ChatHeader({ title, aiName, chatState, progress, progressDetail, removeBranding, themeColor = "#10b981" }: ChatHeaderProps) {
    const isCompleted = chatState === 'COMPLETED';
    const isError = chatState === 'ERROR';
    const isReviewing = chatState === 'CONFIRMING' || chatState === 'READY_TO_SUBMIT';

    const progressLabel = (() => {
        if (isCompleted) return 'Completed';
        if (isError) return 'Submission failed';
        if (isReviewing) return 'Review your answers';
        if (progressDetail && progressDetail.totalFields > 0) {
            const current = Math.min(progressDetail.currentFieldIndex + 1, progressDetail.totalFields);
            return `Question ${current} of ${progressDetail.totalFields}`;
        }
        return `${progress}% Complete`;
    })();

    const progressValue = progressDetail?.percentage ?? progress;

    return (
        <div className="shrink-0">
            <header className="px-4 h-14 border-b border-white/5 bg-[#0B0B0F] flex items-center justify-between gap-4 sticky top-0 z-10">
                {/* Left: Logo + form title */}
                <div className="flex items-center gap-3 min-w-0">
                    {!removeBranding && (
                        <>
                            <div className="relative w-6 h-6 shrink-0 opacity-80">
                                <Image src="/logo.png" alt="0Fill" fill className="object-contain" />
                            </div>
                            <div className="w-px h-4 bg-gray-800 shrink-0" />
                        </>
                    )}
                    <p className="text-sm font-medium text-gray-300 truncate">{title}</p>
                </div>

                {/* Right: progress or done state */}
                <div className="shrink-0 text-xs text-gray-500 font-medium">
                    {isCompleted ? (
                        <span className="font-bold uppercase tracking-widest text-[10px]" style={{ color: themeColor }}>Completed</span>
                    ) : isError ? (
                        <span className="text-red-400">Submission failed</span>
                    ) : (
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest tabular-nums">
                                {progressValue}% <span className="text-gray-600 ml-1">Complete</span>
                            </p>
                            <div className="w-16 h-1 bg-gray-800/60 rounded-full overflow-hidden shrink-0 border border-white/5">
                                <div
                                    className="h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                    style={{ width: `${progressValue}%`, backgroundColor: themeColor }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {!isCompleted && (
                <div className="px-4 py-2.5 border-b border-white/5 bg-[#0B0B0F]/90">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="text-xs font-medium text-gray-400 truncate">
                            {progressLabel}
                        </p>
                        <p className="text-[10px] text-gray-600 tabular-nums shrink-0">
                            {progressValue}%
                        </p>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progressValue}%`, backgroundColor: isError ? '#f87171' : themeColor }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
