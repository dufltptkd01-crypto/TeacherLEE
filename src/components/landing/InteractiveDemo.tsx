"use client";

import { useState, useRef, useEffect } from "react";

const demoConversation = [
    {
        role: "ai" as const,
        text: "안녕하세요! 저는 Teacher Lee입니다. 😊 무엇을 도와드릴까요?",
        delay: 0,
    },
    {
        role: "user" as const,
        text: "한국어 존댓말을 연습하고 싶어요",
        delay: 1500,
    },
    {
        role: "ai" as const,
        text: "좋아요! 상황극을 해볼까요? 🎭\n\n당신은 지금 카페에 있고, 점원에게 주문을 해야 합니다. 한번 말해보세요!",
        delay: 3000,
    },
    {
        role: "user" as const,
        text: "커피 한잔 주세요",
        delay: 5500,
    },
    {
        role: "ai" as const,
        text: "잘했어요! ✅ 하지만 더 자연스럽게 말해볼까요?\n\n💡 \"아메리카노 한 잔 주시겠어요?\" 가 더 자연스러운 존댓말이에요.\n\n📝 '주세요' vs '주시겠어요?'\n→ '주시겠어요?'가 더 정중한 표현이에요.",
        delay: 7000,
    },
];

export default function InteractiveDemo() {
    const [messages, setMessages] = useState<typeof demoConversation>([]);
    const [started, setStarted] = useState(false);
    const [inputText, setInputText] = useState("");
    const chatRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.4 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;

        demoConversation.forEach((msg) => {
            setTimeout(() => {
                setMessages((prev) => [...prev, msg]);
            }, msg.delay);
        });
    }, [started]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <section ref={sectionRef} className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] mb-4">
                        Live Demo
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        지금 바로 <span className="gradient-text">체험</span>해보세요
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        회원가입 없이, AI 선생님과의 대화를 직접 경험해보세요
                    </p>
                </div>

                {/* Chat Window */}
                <div className="max-w-2xl mx-auto">
                    <div className="glass rounded-2xl overflow-hidden shadow-2xl">
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-lg">
                                🤖
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-[var(--text-primary)]">AI Teacher Lee</div>
                                <div className="text-xs text-[var(--secondary)] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] animate-pulse" />
                                    응답 중...
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[var(--text-muted)]/30" />
                                <div className="w-3 h-3 rounded-full bg-[var(--text-muted)]/30" />
                                <div className="w-3 h-3 rounded-full bg-[var(--text-muted)]/30" />
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={chatRef} className="h-80 overflow-y-auto p-6 space-y-4 scroll-smooth">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-3 animate-slide-up ${msg.role === "user" ? "justify-end" : ""
                                        }`}
                                >
                                    {msg.role === "ai" && (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs shrink-0 mt-1">
                                            AI
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-sm rounded-xl px-4 py-3 text-sm whitespace-pre-line ${msg.role === "user"
                                            ? "bg-[var(--primary)] text-white rounded-tr-sm"
                                            : "glass rounded-tl-sm text-[var(--text-primary)]"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {messages.length === 0 && started && (
                                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                    AI가 응답을 준비 중입니다...
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]/30">
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                                    🎤
                                </button>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="메시지를 입력하세요... (데모)"
                                    className="flex-1 bg-[var(--bg-primary)] rounded-full px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none border border-[var(--border)] focus:border-[var(--primary)] transition-colors"
                                />
                                <button className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:bg-[var(--primary-light)] transition-colors">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12l7-4-7-4v8z" fill="currentColor" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-center text-xs text-[var(--text-muted)] mt-3">
                                💡 정식 버전에서는 음성 대화, 코드 리뷰 등 더 많은 기능을 사용할 수 있어요
                            </p>
                        </div>
                    </div>

                    {/* CTA below demo */}
                    <div className="text-center mt-8">
                        <button className="btn-primary text-base !py-3.5 !px-8">
                            무료로 시작하기 →
                        </button>
                        <p className="text-xs text-[var(--text-muted)] mt-3">
                            신용카드 불필요 · 3분 만에 시작
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
