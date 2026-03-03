"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { Zap, Shield, BarChart3 } from 'lucide-react';

const FEATURE_PILLS = [
    { icon: Zap, label: 'AI-Powered Conversations' },
    { icon: Shield, label: 'Secure Data Collection' },
    { icon: BarChart3, label: 'Real-time Analytics' },
];

export function HeroDashboardReveal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const dashRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const dashScale = useTransform(scrollYProgress, [0.1, 0.9], [0.95, 1]);
    const dashTranslateY = useTransform(scrollYProgress, [0.1, 0.9], [30, 0]);
    const auraOpacity = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dashRef.current) return;
        const rect = dashRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -0.8;
        const rotateY = ((x - centerX) / centerX) * 0.8;
        dashRef.current.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.001, 1.001, 1.001)`;
    };

    const handleMouseLeave = () => {
        if (!dashRef.current) return;
        dashRef.current.style.transform = `perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    return (
        <>
            {/* ── MOBILE LAYOUT (hidden on md+) ────────────────────────────── */}
            <div className="md:hidden px-5 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    {/* Aura glow */}
                    <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.25)_0%,transparent_70%)] blur-[60px] pointer-events-none" />

                    {/* Card frame */}
                    <div className="relative rounded-2xl overflow-hidden border border-brand-purple/30 bg-[#0B0B0F] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(16,185,129,0.3)]">
                        {/* Top bar chrome */}
                        <div className="flex items-center gap-1.5 px-4 py-3 bg-[#111116] border-b border-gray-800/60">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                            <div className="ml-auto flex items-center gap-1 bg-[#1C1C24] rounded px-2 py-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
                                <span className="text-[9px] text-gray-500 font-mono">formless.app/dashboard</span>
                            </div>
                        </div>

                        {/* Dashboard image – portrait-friendly crop (top 60% of image) */}
                        <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                            <Image
                                src="/dashboard.png"
                                alt="Formless Dashboard Interface"
                                fill
                                className="object-cover object-left-top select-none filter brightness-[1.18] contrast-[1.08]"
                                priority
                            />
                            {/* Bottom fade to dark */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0B0F] to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Rim glow */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-purple/20 pointer-events-none" />
                </motion.div>

                {/* Feature pills row */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap justify-center gap-2 mt-6"
                >
                    {FEATURE_PILLS.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-1.5 bg-[#111116] border border-gray-800/60 rounded-full px-3 py-1.5"
                        >
                            <Icon className="w-3 h-3 text-brand-purple shrink-0" />
                            <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── DESKTOP LAYOUT (hidden on mobile) ────────────────────────── */}
            <div ref={containerRef} className="hidden md:block relative h-[120vh] w-full pt-10">
                <div className="sticky top-24 h-[75vh] w-full flex items-center justify-center overflow-visible">

                    {/* Aura Halo */}
                    <motion.div
                        style={{ opacity: auraOpacity }}
                        className="absolute inset-x-0 w-[130%] h-[130%] left-1/2 -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.35)_0%,transparent_65%)] blur-[100px] pointer-events-none z-0"
                    />

                    {/* Dashboard Preview Container */}
                    <motion.div
                        style={{
                            scale: dashScale,
                            opacity: 1,
                            y: dashTranslateY,
                        }}
                        className="relative w-full max-w-6xl mx-auto px-6 z-10"
                    >
                        <div style={{ perspective: "2000px" }}>
                            <div
                                ref={dashRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                className="relative w-full aspect-video rounded-[32px] overflow-hidden border border-brand-purple/40 bg-[#0B0B0F] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9),0_0_80px_-20px_rgba(16,185,129,0.4)] transition-transform duration-500 ease-out transform-gpu"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <Image
                                    src="/dashboard.png"
                                    alt="Formless Dashboard Interface"
                                    fill
                                    className="object-left-top object-cover select-none filter brightness-[1.22] contrast-[1.1]"
                                    priority
                                />
                                <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-brand-purple/30 pointer-events-none" />
                                <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_0_60px_rgba(255,255,255,0.08)] pointer-events-none" />
                            </div>
                        </div>

                        {/* Ground Glow */}
                        <motion.div
                            style={{ opacity: auraOpacity }}
                            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-32 bg-[rgba(16,185,129,0.3)] blur-[120px] rounded-full pointer-events-none -z-10"
                        />
                    </motion.div>
                </div>
            </div>
        </>
    );
}
