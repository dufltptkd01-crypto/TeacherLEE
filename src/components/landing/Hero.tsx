"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const phrases = [
    { text: "한국어를 배우고 싶어요!", lang: "🇰🇷 Korean" },
    { text: "I want to learn JavaScript!", lang: "🇺🇸 English" },
    { text: "日本語を勉強したいです！", lang: "🇯🇵 Japanese" },
    { text: "我想学习编程！", lang: "🇨🇳 Chinese" },
];

export default function Hero() {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = phrases[phraseIndex];
        let timeout: ReturnType<typeof setTimeout>;

        if (!isDeleting && charIndex < current.text.length) {
            timeout = setTimeout(() => setCharIndex((c) => c + 1), 60);
        } else if (!isDeleting && charIndex === current.text.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && charIndex > 0) {
            timeout = setTimeout(() => setCharIndex((c) => c - 1), 30);
        } else if (isDeleting && charIndex === 0) {
            timeout = setTimeout(() => {
                setIsDeleting(false);
                setPhraseIndex((i) => (i + 1) % phrases.length);
            }, 0);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, phraseIndex]);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden hero-grid">
            {/* Background Effects */}
            <div className="hero-glow -top-40 -left-20" />
            <div className="hero-glow -bottom-40 -right-20 opacity-50" style={{ background: "radial-gradient(circle, rgba(255, 140, 66, 0.08) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left: Copy */}
                <div className="flex flex-col gap-8 animate-slide-up">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 w-fit text-sm bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                        <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
                        <span className="text-[var(--primary)] font-medium">AI 기반 맞춤형 교육 플랫폼</span>
                    </div>

                    <h1 className="text-[clamp(2.1rem,10vw,3.75rem)] font-bold leading-[1.12] tracking-tight break-keep max-w-[14ch] sm:max-w-none">
                        <span className="text-[var(--text-primary)]">AI가 당신만의</span>{" "}
                        <span className="gradient-text">선생님</span>
                        <span className="text-[var(--text-primary)]">이 되어드립니다</span>
                    </h1>

                    <p className="text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed">
                        한국어, 영어, 일본어, 중국어 그리고 프로그래밍까지.
                        <br />
                        AI 강사와 <strong className="text-[var(--primary)]">실시간 대화</strong>하며 배우는 새로운 방식의 학습 경험.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/login" className="btn-primary text-base !py-3.5 !px-8 animate-pulse-glow">
                            무료로 시작하기 →
                        </Link>
                        <Link href="/dashboard/chat" className="btn-secondary text-base !py-3.5 !px-8">
                            데모 체험하기
                        </Link>
                    </div>

                    {/* Micro Stats */}
                    <div className="flex gap-8 pt-2">
                        {[
                            { value: "5,000+", label: "학습자" },
                            { value: "42", label: "개국" },
                            { value: "4.9/5", label: "평점" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col">
                                <span className="text-2xl font-bold text-[var(--primary)]">{stat.value}</span>
                                <span className="text-xs text-[var(--text-muted)]">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: AI Chat Demo (dark card for contrast) */}
                <div className="animate-slide-up stagger-2 opacity-0 lg:block">
                    <div className="chat-demo-card rounded-2xl p-6 space-y-4 relative card-hover shadow-lg">
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-lg">
                                🤖
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">AI Teacher Lee</div>
                                <div className="text-xs text-[var(--secondary)]">● Online</div>
                            </div>
                            <div className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/20 text-[var(--primary-light)]">
                                {phrases[phraseIndex].lang}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs shrink-0 mt-1">
                                    AI
                                </div>
                                <div className="chat-bubble-ai rounded-xl rounded-tl-sm px-4 py-3 max-w-xs">
                                    <p className="text-sm text-white/90">
                                        안녕하세요! 👋 오늘은 무엇을 배우고 싶으신가요? 언어, 코딩, 시험 대비 모두 도와드릴 수 있어요!
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <div className="bg-[var(--primary)] rounded-xl rounded-tr-sm px-4 py-3 max-w-xs">
                                    <p className="text-sm text-white font-mono">
                                        {phrases[phraseIndex].text.slice(0, charIndex)}
                                        <span className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 animate-pulse" />
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs shrink-0 mt-1">
                                    AI
                                </div>
                                <div className="chat-bubble-ai rounded-xl rounded-tl-sm px-4 py-3 max-w-xs">
                                    <p className="text-sm text-white/90">
                                        좋아요! 당신의 레벨에 맞는 맞춤 커리큘럼을 만들어 드릴게요. 먼저 간단한 레벨 테스트를 해볼까요? 🎯
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div className="flex gap-2 pt-2">
                            <div className="flex-1 chat-input rounded-full px-4 py-2.5 text-sm flex items-center gap-2">
                                <span>🎤</span>
                                <span>메시지를 입력하세요...</span>
                            </div>
                            <Link href="/login" className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:bg-[var(--primary-light)] transition-colors">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l7-4-7-4v8z" fill="currentColor" /></svg>
                            </Link>
                        </div>

                        {/* Decorative Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 blur-2xl -z-10 rounded-2xl" />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
                <span className="text-xs text-[var(--text-muted)]">스크롤하여 더 알아보기</span>
                <svg width="20" height="20" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path d="M6 8l4 4 4-4" />
                </svg>
            </div>
        </section>
    );
}
