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
        text: "안녕하세요! 저는 Teacher Lee입니다. 😊\n\n오늘은 무엇을 배우고 싶으신가요? 아래에서 선택하거나 자유롭게 말씀해주세요!\n\n• 🗣️ 일상 회화 연습\n• 📝 문법 학습\n• 📖 읽기 연습\n• 🎧 듣기 연습",
        timestamp: "오후 11:30",
    },
];

const quickReplies = [
    "한국어 존댓말을 알려주세요",
    "일상 대화 연습하기",
    "문법 퀴즈 풀기",
    "발음 교정 받기",
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

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: messages.length + 1,
            role: "user",
            text: text.trim(),
            timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulated AI response
        setTimeout(() => {
            const aiResponses: Record<string, string> = {
                "한국어 존댓말을 알려주세요":
                    "좋아요! 존댓말(敬語)은 한국어에서 아주 중요해요. 🙂\n\n**기본 원칙**: 동사/형용사 어간 + '-요' / '-습니다'\n\n**예시:**\n• 먹다 → 먹어요 (casual polite) → 드십니다 (formal)\n• 가다 → 가요 → 가십니다\n• 하다 → 해요 → 하십니다\n\n💡 **팁**: 처음 만난 사람이나 나이가 많은 분에게는 항상 존댓말을 사용하세요!\n\n연습해볼까요? 아래 문장을 존댓말로 바꿔보세요:\n> \"나 배고파\"",
                "일상 대화 연습하기":
                    "좋아요! 상황극을 해볼까요? 🎭\n\n**상황**: 당신은 서울의 카페에 있습니다. 점원에게 주문을 해보세요.\n\n점원(AI): \"어서오세요! 주문하시겠어요?\"\n\n👉 한국어로 대답해보세요!",
                "문법 퀴즈 풀기":
                    "📝 문법 퀴즈를 시작합니다!\n\n**Q1.** 빈칸에 알맞은 조사를 넣으세요:\n\n> \"저는 학교___ 갑니다.\"\n\n(a) 을  (b) 에  (c) 를  (d) 에서\n\n정답을 말씀해주세요!",
                "발음 교정 받기":
                    "🎤 발음 교정 모드를 시작합니다!\n\n음성 녹음 버튼(🎤)을 눌러 아래 문장을 읽어보세요:\n\n> **\"안녕하세요, 만나서 반갑습니다.\"**\n\n(현재 데모 버전에서는 텍스트로 입력해주시면 발음 피드백을 제공해드립니다.)",
            };

            const defaultResponse =
                "좋은 질문이에요! 😊\n\n해당 내용에 대해 자세히 설명해드릴게요. 한국어 학습에서 가장 중요한 것은 꾸준한 연습이에요.\n\n더 궁금한 점이 있으면 자유롭게 물어보세요!";

            const aiMsg: Message = {
                id: messages.length + 2,
                role: "ai",
                text: aiResponses[text.trim()] || defaultResponse,
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            };

            setIsTyping(false);
            setMessages((prev) => [...prev, aiMsg]);
        }, 1500);
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
                        className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:bg-[var(--primary-light)] transition-colors shrink-0"
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
