"use client";

import { useState, useRef, useEffect } from "react";
import { addStudyEvent, getOnboardingPlan } from "@/lib/learning/clientStore";

interface Message {
    id: number;
    role: "user" | "ai";
    text: string;
    timestamp: string;
}

const initialMessages: Message[] = [
    {
        id: 1,
        role: "ai",
        text: "안녕하세요! 저는 Teacher Lee입니다. 😊\n\n오늘은 무엇을 배우고 싶으신가요? 아래에서 선택하거나 자유롭게 말씀해주세요!\n\n• 🗣️ 일상 회화 연습\n• 📝 문법 학습\n• 📖 읽기 연습\n• 💻 코딩 학습",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    },
];

const quickReplies = [
    "한국어 존댓말을 알려주세요",
    "일상 대화 연습하기",
    "문법 퀴즈 풀기",
    "JavaScript 기초 배우기",
];

const subjects = [
    { id: "korean", flag: "🇰🇷", name: "한국어" },
    { id: "english", flag: "🇺🇸", name: "English" },
    { id: "japanese", flag: "🇯🇵", name: "日本語" },
    { id: "chinese", flag: "🇨🇳", name: "中文" },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("korean");
    const [lastFailedText, setLastFailedText] = useState<string | null>(null);
    const [connectionState, setConnectionState] = useState<"ok" | "unstable">("ok");
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        const plan = getOnboardingPlan();
        const preferred = plan?.subjects?.find((s) => s.type === "language");
        if (preferred?.id && ["korean", "english", "japanese", "chinese"].includes(preferred.id)) {
            setSelectedSubject(preferred.id);
        }
    }, []);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = {
            id: messages.length + 1,
            role: "user",
            text: text.trim(),
            timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setIsTyping(true);
        setLastFailedText(null);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    message: text.trim(),
                    subject: selectedSubject,
                    history: updatedMessages.slice(-10).map((m) => ({
                        role: m.role === "ai" ? "assistant" : "user",
                        content: m.text,
                    })),
                }),
            });

            clearTimeout(timeout);

            let aiText: string;

            if (res.ok) {
                const data = await res.json();
                aiText = data.reply || data.message || "죄송합니다, 응답을 처리하지 못했어요.";
                setConnectionState("ok");
                addStudyEvent({
                    kind: "chat",
                    subject: selectedSubject,
                    at: new Date().toISOString(),
                });
            } else {
                aiText = "⚠️ AI 서비스 연결이 불안정합니다. 다시 시도해주세요.";
                setConnectionState("unstable");
                setLastFailedText(text.trim());
            }

            const aiMsg: Message = {
                id: updatedMessages.length + 1,
                role: "ai",
                text: aiText,
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            setConnectionState("unstable");
            setLastFailedText(text.trim());
            const errorMsg: Message = {
                id: updatedMessages.length + 1,
                role: "ai",
                text: "⚠️ 응답이 지연되거나 연결이 끊겼어요. 아래 '다시 보내기'를 눌러 재시도해 주세요.",
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-[calc(100dvh-56px-84px)] lg:h-screen flex flex-col relative">
            {/* Chat Header */}
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-lg">
                    🤖
                </div>
                <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                        AI Teacher Lee
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${connectionState === "ok" ? "text-[var(--secondary)]" : "text-amber-300"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${connectionState === "ok" ? "bg-[var(--secondary)] animate-pulse" : "bg-amber-300"}`} />
                        {connectionState === "ok" ? "온라인" : "재연결 중"}
                    </div>
                </div>

                {/* Subject Selector */}
                <div className="hidden sm:flex gap-1">
                    {subjects.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedSubject(s.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSubject === s.id
                                ? "bg-[var(--primary)]/20 text-[var(--primary-light)] border border-[var(--primary)]/30"
                                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                }`}
                        >
                            {s.flag}
                        </button>
                    ))}
                </div>

                <div className="sm:hidden">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-2 text-xs text-[var(--text-secondary)]"
                    >
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.flag} {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-1.5">
                    <button className="w-11 h-11 rounded-full glass flex items-center justify-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        📊
                    </button>
                    <button className="w-11 h-11 rounded-full glass flex items-center justify-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        ⚙️
                    </button>
                </div>
            </div>

            {connectionState === "unstable" && (
                <div className="shrink-0 mx-3 sm:mx-4 lg:mx-6 mt-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-amber-200">연결이 불안정합니다. 메시지가 누락되면 재전송해 주세요.</p>
                    {lastFailedText && (
                        <button
                            onClick={() => sendMessage(lastFailedText)}
                            disabled={isTyping}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 disabled:opacity-50"
                        >
                            다시 보내기
                        </button>
                    )}
                </div>
            )}

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : ""
                            }`}
                    >
                        {msg.role === "ai" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs shrink-0 mt-1">
                                AI
                            </div>
                        )}
                        <div className="max-w-lg">
                            <div
                                className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${msg.role === "user"
                                    ? "bg-[var(--primary)] text-white rounded-tr-sm"
                                    : "glass rounded-tl-sm text-[var(--text-primary)]"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <div
                                className={`text-[10px] text-[var(--text-muted)] mt-1 ${msg.role === "user" ? "text-right" : ""
                                    }`}
                            >
                                {msg.timestamp}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs shrink-0">
                            AI
                        </div>
                        <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Replies */}
            <div className="shrink-0 px-3 sm:px-4 lg:px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                {quickReplies.map((qr) => (
                    <button
                        key={qr}
                        onClick={() => sendMessage(qr)}
                        className="shrink-0 glass rounded-full min-h-11 px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:border-[var(--primary)]/50 transition-all whitespace-nowrap"
                    >
                        {qr}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]/30 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                <div className="flex gap-2 items-end max-w-4xl mx-auto">
                    <button className="w-11 h-11 rounded-full glass flex items-center justify-center text-lg text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors shrink-0">
                        🎤
                    </button>
                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(input);
                                }
                            }}
                            placeholder="메시지를 입력하세요... (Enter로 전송)"
                            rows={1}
                            className="w-full min-h-11 max-h-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl px-4 py-3 pr-12 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition-colors resize-none"
                        />
                    </div>
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={isTyping}
                        className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:bg-[var(--primary-light)] transition-colors shrink-0 disabled:opacity-50"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12l7-4-7-4v8z" fill="currentColor" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
