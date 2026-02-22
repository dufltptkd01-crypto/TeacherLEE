"use client";

import { useState, useRef, useEffect } from "react";

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
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

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

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text.trim(),
                    subject: selectedSubject,
                    history: updatedMessages.slice(-10).map((m) => ({
                        role: m.role === "ai" ? "assistant" : "user",
                        content: m.text,
                    })),
                }),
            });

            let aiText: string;

            if (res.ok) {
                const data = await res.json();
                aiText = data.reply || data.message || "죄송합니다, 응답을 처리하지 못했어요.";
            } else {
                aiText = "⚠️ AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
            }

            const aiMsg: Message = {
                id: updatedMessages.length + 1,
                role: "ai",
                text: aiText,
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            };

            setIsTyping(false);
            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            setIsTyping(false);
            const errorMsg: Message = {
                id: updatedMessages.length + 1,
                role: "ai",
                text: "⚠️ 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    return (
        <div className="h-screen lg:h-screen flex flex-col relative">
            {/* Chat Header */}
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 px-4 lg:px-6 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-lg">
                    🤖
                </div>
                <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                        AI Teacher Lee
                    </div>
                    <div className="text-xs text-[var(--secondary)] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] animate-pulse" />
                        온라인
                    </div>
                </div>

                {/* Subject Selector */}
                <div className="flex gap-1">
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

                <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-full glass flex items-center justify-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        📊
                    </button>
                    <button className="w-9 h-9 rounded-full glass flex items-center justify-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        ⚙️
                    </button>
                </div>
            </div>

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
            <div className="shrink-0 px-4 lg:px-6 py-2 flex gap-2 overflow-x-auto">
                {quickReplies.map((qr) => (
                    <button
                        key={qr}
                        onClick={() => sendMessage(qr)}
                        className="shrink-0 glass rounded-full px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:border-[var(--primary)]/50 transition-all whitespace-nowrap"
                    >
                        {qr}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]/30 px-4 lg:px-6 py-4 mb-14 lg:mb-0">
                <div className="flex gap-2 items-end max-w-4xl mx-auto">
                    <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors shrink-0">
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
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl px-4 py-3 pr-12 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition-colors resize-none"
                        />
                    </div>
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={isTyping}
                        className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:bg-[var(--primary-light)] transition-colors shrink-0 disabled:opacity-50"
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
