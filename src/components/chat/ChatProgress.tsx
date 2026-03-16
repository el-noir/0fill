'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressDetail, SectionProgress } from './types';

interface ChatProgressProps {
    progressDetail: ProgressDetail;
    chatState: string;
    themeColor?: string;
}

function getStateLabel(chatState: string, progressDetail: ProgressDetail): string {
    switch (chatState) {
        case 'CLARIFYING':
            return 'Please clarify...';
        case 'CONFIRMING':
            return 'Review your answers';
        case 'READY_TO_SUBMIT':
            return 'Submitting...';
        case 'COMPLETED':
            return 'Done!';
        case 'ERROR':
            return 'Submission failed';
        default:
            return `Question ${progressDetail.currentFieldIndex + 1} of ${progressDetail.totalFields}`;
    }
}

/** Dot-based step indicator — great for 6-15 questions */
function DotIndicator({ progressDetail, themeColor = "#10b981" }: { progressDetail: ProgressDetail, themeColor?: string }) {
    return (
        <div className="flex items-center gap-1">
            {progressDetail.fields.map((field) => (
                <div
                    key={field.fieldId}
                    title={field.label}
                    className={cn(
                        'rounded-full transition-all duration-300',
                        field.status === 'completed' && 'w-2 h-2 opacity-80',
                        field.status === 'current' && 'w-2.5 h-2.5 ring-2 scale-110',
                        field.status === 'upcoming' && 'w-2 h-2 bg-gray-700',
                        field.status === 'skipped' && 'w-2 h-2 bg-yellow-500/60',
                    )}
                    style={{
                        backgroundColor: field.status === 'completed' || field.status === 'current' ? themeColor : undefined,
                        boxShadow: field.status === 'current' ? `0 0 0 2px ${themeColor}4d` : undefined
                    }}
                />
            ))}
        </div>
    );
}

/** Collapsible step list with labels — great for ≤5 questions */
function StepList({ progressDetail, themeColor = "#10b981" }: { progressDetail: ProgressDetail, themeColor?: string }) {
    const [expanded, setExpanded] = useState(false);

    // Show only the current + 1 next when collapsed
    const visibleFields = expanded
        ? progressDetail.fields
        : progressDetail.fields.filter(
            (f) => f.status === 'current' || f.status === 'completed'
                ? true
                : f.questionNumber === (progressDetail.currentFieldIndex + 2) // next one
        );

    const hasMore = progressDetail.fields.length > visibleFields.length;

    return (
        <div className="space-y-1">
            {visibleFields.map((field) => (
                <div
                    key={field.fieldId}
                    className={cn(
                        'flex items-center gap-2.5 transition-all duration-300',
                        field.status === 'upcoming' && 'opacity-40',
                    )}
                >
                    <div
                        className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300',
                            field.status === 'completed' && 'text-white',
                            field.status === 'current' && 'ring-1',
                            field.status === 'upcoming' && 'bg-gray-800 text-gray-500',
                            field.status === 'skipped' && 'bg-yellow-500/20 text-yellow-400',
                        )}
                        style={{
                            backgroundColor: field.status === 'completed' ? themeColor : field.status === 'current' ? `${themeColor}33` : undefined,
                            color: field.status === 'current' ? themeColor : undefined,
                            borderColor: field.status === 'current' ? `${themeColor}66` : undefined
                        }}
                    >
                        {field.status === 'completed' ? (
                            <Check className="w-3 h-3" />
                        ) : (
                            field.questionNumber
                        )}
                    </div>
                    <span
                        className={cn(
                            'text-xs truncate transition-colors duration-300',
                            field.status === 'current' && 'text-white font-medium',
                            field.status === 'completed' && 'text-gray-500 line-through',
                            field.status === 'upcoming' && 'text-gray-600',
                            field.status === 'skipped' && 'text-yellow-400/60',
                        )}
                    >
                        {field.label}
                    </span>
                </div>
            ))}
            {(hasMore || expanded) && progressDetail.fields.length > 3 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-400 transition-colors mt-0.5 pl-7"
                >
                    {expanded ? (
                        <>
                            <ChevronUp className="w-3 h-3" /> Show less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-3 h-3" /> {progressDetail.fields.length - visibleFields.length} more
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

/** Thin animated progress bar */
function ProgressBar({ percentage, themeColor = "#10b981" }: { percentage: number, themeColor?: string }) {
    return (
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentage}%`, backgroundColor: themeColor }}
            />
        </div>
    );
}

/** Page stepper for multi-page/section forms */
function PageStepper({ progressDetail, themeColor = "#10b981" }: { progressDetail: ProgressDetail, themeColor?: string }) {
    if (!progressDetail.sections || progressDetail.sections.length <= 1) return null;

    const currentSection = progressDetail.sections[progressDetail.currentPage - 1];

    return (
        <div className="space-y-2">
            {/* Step circles with connectors */}
            <div className="flex items-center justify-center gap-1">
                {progressDetail.sections.map((section, i) => (
                    <div key={section.sectionId} className="flex items-center gap-1">
                        <div
                            title={section.title}
                            className={cn(
                                'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300',
                                section.status === 'completed' && 'text-white',
                                section.status === 'current' && 'ring-2',
                                section.status === 'upcoming' && 'bg-gray-800 text-gray-500',
                            )}
                            style={{
                                backgroundColor: section.status === 'completed' ? themeColor : section.status === 'current' ? `${themeColor}33` : undefined,
                                color: section.status === 'current' ? themeColor : undefined,
                                boxShadow: section.status === 'current' ? `0 0 0 2px ${themeColor}4d` : undefined
                            }}
                        >
                            {section.status === 'completed' ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                section.pageNumber
                            )}
                        </div>
                        {i < progressDetail.sections!.length - 1 && (
                            <div
                                className={cn(
                                    'h-0.5 w-5 rounded-full transition-all duration-500',
                                )}
                                style={{ backgroundColor: section.status === 'completed' ? themeColor : '#1f2937' }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Current section label */}
            {currentSection && (
                <p className="text-center text-[11px] font-medium" style={{ color: themeColor }}>
                    Page {progressDetail.currentPage}: {currentSection.title}
                    <span className="text-gray-600 ml-1.5 opacity-80">
                        ({currentSection.answeredCount}/{currentSection.totalFields})
                    </span>
                </p>
            )}
        </div>
    );
}

/**
 * Smart progress component that adapts to the number of fields:
 * - Multi-page forms → page stepper + progress bar + adaptive detail
 * - ≤5 fields  → step list with labels + progress bar
 * - 6-15 fields → dot indicator + progress bar
 * - 15+ fields  → progress bar + text counter
 */
export function ChatProgress({ progressDetail, chatState, themeColor = "#10b981" }: ChatProgressProps) {
    const label = getStateLabel(chatState, progressDetail);
    const totalFields = progressDetail.totalFields;
    const isDone = chatState === 'COMPLETED' || chatState === 'CONFIRMING' || chatState === 'READY_TO_SUBMIT';
    const hasMultiplePages = progressDetail.sections && progressDetail.sections.length > 1;

    return (
        <div className="px-4 py-3 space-y-2.5 border-b border-gray-800/60 bg-[#0B0B0F]/80 backdrop-blur-sm">
            {/* Page stepper — only for multi-page forms */}
            {hasMultiplePages && !isDone && (
                <PageStepper progressDetail={progressDetail} themeColor={themeColor} />
            )}

            {/* Top row: label + percentage */}
            <div className="flex items-center justify-between">
                <span className={cn(
                    'text-xs font-medium',
                    isDone ? 'opacity-100' : 'text-gray-400',
                )} style={isDone ? { color: themeColor } : {}}>
                    {label}
                </span>
                <span className="text-[10px] text-gray-600 tabular-nums">
                    {progressDetail.percentage}%
                </span>
            </div>

            {/* Progress bar — always shown */}
            <ProgressBar percentage={progressDetail.percentage} themeColor={themeColor} />

            {/* Adaptive detail view */}
            {!isDone && (
                <div className="pt-0.5">
                    {totalFields <= 5 ? (
                        <StepList progressDetail={progressDetail} themeColor={themeColor} />
                    ) : totalFields <= 15 ? (
                        <DotIndicator progressDetail={progressDetail} themeColor={themeColor} />
                    ) : null /* 15+ just shows bar + counter above */}
                </div>
            )}
        </div>
    );
}

/** Compact inline progress for embed mode headers */
export function ChatProgressCompact({ progressDetail, chatState, themeColor = "#10b981" }: ChatProgressProps) {
    const isDone = chatState === 'COMPLETED';
    const isError = chatState === 'ERROR';

    return (
        <div className="flex items-center gap-2.5">
            {/* Mini dot indicator (max 10 shown, rest collapsed) */}
            <div className="flex items-center gap-0.5">
                {progressDetail.fields.slice(0, 10).map((field) => (
                    <div
                        key={field.fieldId}
                        className={cn(
                            'w-1.5 h-1.5 rounded-full transition-all duration-300',
                            field.status === 'completed' && 'opacity-80',
                            field.status === 'current' && 'scale-125',
                            field.status === 'upcoming' && 'bg-gray-700',
                            field.status === 'skipped' && 'bg-yellow-500/60',
                        )}
                        style={{
                            backgroundColor: field.status === 'completed' || field.status === 'current' ? themeColor : undefined
                        }}
                    />
                ))}
                {progressDetail.totalFields > 10 && (
                    <span className="text-[8px] text-gray-600 ml-0.5">+{progressDetail.totalFields - 10}</span>
                )}
            </div>
            <span className={cn(
                'text-[10px] tabular-nums',
                isDone || isError ? 'opacity-100' : 'text-gray-500',
            )} style={isDone ? { color: themeColor } : isError ? { color: '#f87171' } : {}}>
                {isDone ? 'Done' : isError ? 'Failed' : `${progressDetail.percentage}%`}
            </span>
        </div>
    );
}
