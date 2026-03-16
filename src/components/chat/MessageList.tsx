import React from 'react';
import { MessageItem } from './MessageItem';
import { Message } from './types';
import { Sparkles } from 'lucide-react';

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    aiName?: string;
    aiAvatar?: string;
    isEmbed?: boolean;
}

export function MessageList({ messages, isTyping, messagesEndRef, aiName, aiAvatar, isEmbed = false }: MessageListProps) {
    return (
        <main
            className="flex-1 overflow-y-auto relative z-10"
            role="log"
            aria-live="polite"
        >
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 w-full">
                {messages.map((msg, idx) => (
                    <MessageItem
                        key={idx}
                        message={msg}
                        aiName={aiName}
                        aiAvatar={aiAvatar}
                        isEmbed={isEmbed}
                    />
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-sm shrink-0 pt-0.5 overflow-hidden">
                            {aiAvatar?.startsWith('http') || aiAvatar?.startsWith('/')
                                ? <img src={aiAvatar} alt="" className="w-full h-full object-cover" />
                                : (aiAvatar ? <span className="text-base">{aiAvatar}</span> : <Sparkles className="w-3.5 h-3.5 text-emerald-500" />)
                            }
                        </div>
                        <div className="bg-[#111116] border border-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                            <div className="flex gap-1 items-center h-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </main>
    );
}
