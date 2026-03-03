"use client";

import React from 'react';
import { Background } from '@/components/Background';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChatSession } from '@/hooks/useChatSession';

interface ChatClientProps {
    token: string;
}

export function ChatClient({ token }: ChatClientProps) {
    const {
        formInfo,
        loadingInfo,
        error,
        messages,
        input,
        setInput,
        isTyping,
        chatState,
        progress,
        isSubmitting,
        messagesEndRef,
        handleStart,
        handleSend,
    } = useChatSession(token);

    /* ── Loading ─────────────────────────────────────── */
    if (loadingInfo) {
        return (
            <div className="min-h-[100dvh] bg-[#0B0B0F] flex items-center justify-center">
                <Background />
                <div className="flex flex-col items-center gap-3 relative z-10">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    /* ── Error ──────────────────────────────────────── */
    if (error || !formInfo) {
        return (
            <div className="min-h-[100dvh] bg-[#0B0B0F] flex items-center justify-center px-6 relative">
                <Background />
                <div className="max-w-sm w-full relative z-10 text-center">
                    <p className="text-gray-400 text-sm mb-1">This link isn't available</p>
                    <p className="text-gray-600 text-xs">{error || 'The form may be expired or inactive.'}</p>
                </div>
            </div>
        );
    }

    const aiName: string = formInfo.aiName || 'Assistant';
    const aiAvatar: string | undefined = formInfo.aiAvatar as string | undefined;

    /* ── Welcome screen ─────────────────────────────── */
    if (chatState === 'IDLE' || chatState === 'STARTING') {
        return (
            <div className="min-h-[100dvh] bg-[#0B0B0F] flex flex-col items-center justify-center px-5 py-12 relative">
                <Background />

                <div className="max-w-sm w-full relative z-10 flex flex-col gap-8">
                    {/* Formless mark */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5">
                            <Image src="/logo.png" alt="Formless" fill className="object-contain" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Formless</span>
                    </div>

                    {/* Content */}
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-lg shrink-0">
                                {aiAvatar || '✦'}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{aiName}</p>
                                <p className="text-white text-sm font-semibold">Ready to chat</p>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2 leading-tight">{formInfo.title}</h1>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {formInfo.description || `${aiName} will guide you through ${formInfo.questionCount} questions conversationally.`}
                        </p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                        <span><span className="text-white font-medium">{formInfo.questionCount}</span> questions</span>
                        <span className="text-gray-700">·</span>
                        <span>~<span className="text-white font-medium">{formInfo.estimatedMinutes}</span> min</span>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleStart}
                        disabled={chatState === 'STARTING'}
                        className="w-full bg-brand-purple hover:bg-[#0da372] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        {chatState === 'STARTING'
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Starting...</>
                            : 'Start Conversation'
                        }
                    </button>
                </div>
            </div>
        );
    }

    /* ── Active chat ────────────────────────────────── */
    return (
        <div className="min-h-[100dvh] bg-[#0B0B0F] flex flex-col relative text-white">
            <Background />

            <ChatHeader
                title={formInfo.title}
                aiName={aiName}
                chatState={chatState}
                progress={progress}
            />

            <MessageList
                messages={messages}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
                aiName={aiName}
                aiAvatar={aiAvatar}
            />

            <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                isSubmitting={isSubmitting}
                isTyping={isTyping}
                chatState={chatState}
            />
        </div>
    );
}
