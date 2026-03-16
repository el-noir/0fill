"use client";

import React from "react";
import { Shield, Trash2, Image as ImageIcon, Smile } from "lucide-react";

interface DesignTabProps {
    removeBranding: boolean;
    avatar: string;
    onBrandingChange: (enabled: boolean) => void;
    onAvatarChange: (avatar: string) => void;
}

const EMOJI_AVATARS = ["✨", "🤖", "💬", "🎯", "🧠", "⚡", "🌟", "💡"];

export function DesignTab({ removeBranding, avatar, onBrandingChange, onAvatarChange }: DesignTabProps) {
    const isUrl = avatar.startsWith('http') || avatar.startsWith('/');

    return (
        <div className="space-y-8">
            {/* Whitelabeling Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-brand-purple" />
                    <h3 className="text-sm font-semibold text-white">Whitelabeling</h3>
                </div>
                
                <div className="bg-[#111116] border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white mb-0.5">Remove 0Fill Branding</p>
                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                Hides the "Powered by 0Fill" badge and logo from your public chat interface.
                            </p>
                        </div>
                        <button
                            onClick={() => onBrandingChange(!removeBranding)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${removeBranding ? 'bg-brand-purple' : 'bg-gray-700'}`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${removeBranding ? 'translate-x-4' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                </div>
                
                {!removeBranding && (
                  <div className="mt-3 p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-lg">
                      <p className="text-[10px] text-brand-purple/80 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-brand-purple animate-pulse" />
                          Pro users can remove all branding with one click.
                      </p>
                  </div>
                )}
            </div>

            {/* Custom Avatar Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-4 h-4 text-brand-purple" />
                    <h3 className="text-sm font-semibold text-white">Custom Chat Avatar</h3>
                </div>

                <div className="space-y-4">
                    {/* URL Input */}
                    <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Avatar Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={isUrl ? avatar : ''}
                                onChange={(e) => onAvatarChange(e.target.value)}
                                placeholder="https://example.com/logo.png"
                                className="flex-1 bg-[#111116] border border-gray-800 rounded text-sm text-white px-3 py-2 focus:outline-none focus:border-brand-purple transition-colors placeholder-gray-700"
                            />
                            {isUrl && (
                                <button
                                    onClick={() => onAvatarChange("✨")}
                                    className="p-2 border border-gray-800 rounded hover:bg-red-500/10 hover:border-red-500/30 text-gray-500 hover:text-red-400 transition-all"
                                    title="Reset to default"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Emoji Picker Fallback */}
                    <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Or choose an emoji</label>
                        <div className="flex gap-2 flex-wrap">
                            {EMOJI_AVATARS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => onAvatarChange(emoji)}
                                    className={`w-9 h-9 rounded text-lg transition-all flex items-center justify-center border ${!isUrl && avatar === emoji
                                        ? "border-brand-purple bg-brand-purple/10 scale-110"
                                        : "border-gray-800 bg-[#111116] hover:border-gray-600"
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
