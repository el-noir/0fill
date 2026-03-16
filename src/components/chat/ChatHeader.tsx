import React from 'react';
import Image from 'next/image';
import { ChatProgress } from './ChatProgress';
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
                                {progress}% <span className="text-gray-600 ml-1">Complete</span>
                            </p>
                            <div className="w-16 h-1 bg-gray-800/60 rounded-full overflow-hidden shrink-0 border border-white/5">
                                <div
                                    className="h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                    style={{ width: `${progress}%`, backgroundColor: themeColor }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Detailed progress panel */}
            {progressDetail ? (
                <ChatProgress progressDetail={progressDetail} chatState={chatState} />
            ) : (
                /* Fallback: simple progress bar for non-detailed states */
                !isCompleted && (
                    <div className="h-[1px] bg-gray-900 w-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%`, backgroundColor: themeColor, opacity: 0.3 }}
                        />
                    </div>
                )
            )}
        </div>
    );
}
