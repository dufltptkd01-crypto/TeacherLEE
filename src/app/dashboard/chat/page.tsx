"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
    addStudyEvent,
    getOnboardingPlan,
    hydrateLearningFromCloud,
    syncLearningToCloud,
} from "@/lib/learning/clientStore";

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
        text: "안녕하세요! 저는 Teacher Lee입니다. 😊\n\n오늘은 무엇을 배우고 싶으신가요? 아래 모드(문자학습/단어암기/문장패턴) 또는 자유 대화로 시작해보세요!",
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
    { id: "korean", flag: "🇰🇷", short: "KR", name: "한국어" },
    { id: "english", flag: "🇺🇸", short: "US", name: "English" },
    { id: "japanese", flag: "🇯🇵", short: "JP", name: "日本語" },
    { id: "chinese", flag: "🇨🇳", short: "CN", name: "中文" },
] as const;

const foundationModes = [
    { id: "letters", label: "문자학습", icon: "🔤", description: "문자/발음 퀴즈" },
    { id: "vocab", label: "단어암기", icon: "🧠", description: "단어장 + 암기 + 오답노트" },
    { id: "patterns", label: "문장패턴", icon: "🧩", description: "실전 문장 뼈대 훈련" },
] as const;

const patternTemplates = [
    "자기소개하기",
    "요청/부탁하기",
    "허락 구하기",
    "거절하기",
    "계획 말하기",
    "경험 말하기",
    "이유 설명하기",
    "비교/의견 말하기",
];

type QuizItem = {
    q: string;
    choices: string[];
    answer: string;
};

const letterQuizzes: Record<(typeof subjects)[number]["id"], QuizItem[]> = {
    korean: [
        { q: "'ㅏ'의 발음은?", choices: ["a", "o", "u", "i"], answer: "a" },
        { q: "'ㄱ'은 어느 소리와 가장 가까울까요?", choices: ["g/k", "m", "s", "r"], answer: "g/k" },
    ],
    english: [
        { q: "A의 기본 소리(파닉스)는?", choices: ["æ", "o", "u", "i"], answer: "æ" },
        { q: "B는 어떤 자음 소리?", choices: ["b", "d", "p", "t"], answer: "b" },
    ],
    japanese: [
        { q: "'あ'는 어떤 소리?", choices: ["a", "i", "u", "e"], answer: "a" },
        { q: "'か'는?", choices: ["ka", "sa", "ta", "na"], answer: "ka" },
    ],
    chinese: [
        { q: "병음 'mā'는 몇 성?", choices: ["1성", "2성", "3성", "4성"], answer: "1성" },
        { q: "병음 'ma' (무성조)는?", choices: ["경성", "1성", "2성", "4성"], answer: "경성" },
    ],
};

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<(typeof subjects)[number]["id"]>("korean");
    const [learningMode, setLearningMode] = useState<(typeof foundationModes)[number]["id"] | "free">("free");
    const [lastFailedText, setLastFailedText] = useState<string | null>(null);
    const [connectionState, setConnectionState] = useState<"ok" | "unstable">("ok");

    const [wordInput, setWordInput] = useState("");
    const [savedWords, setSavedWords] = useState<string[]>([]);
    const [masteredWords, setMasteredWords] = useState<string[]>([]);
    const [wrongNotes, setWrongNotes] = useState<string[]>([]);

    const [patternDone, setPatternDone] = useState<string[]>([]);

    const [quiz, setQuiz] = useState(() => pickRandom(letterQuizzes.korean));
    const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

    const [sessionXP, setSessionXP] = useState(0);

    const chatRef = useRef<HTMLDivElement>(null);

    const patternProgress = Math.round((patternDone.length / patternTemplates.length) * 100);

    const badges = useMemo(() => {
        const list: string[] = [];
        if (sessionXP >= 10) list.push("🌟 Starter");
        if (sessionXP >= 30) list.push("🔥 Focus");
        if (masteredWords.length >= 20) list.push("🧠 Vocab 20+");
        if (patternProgress >= 80) list.push("🧩 Pattern Master");
        return list;
    }, [sessionXP, masteredWords.length, patternProgress]);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages, isTyping]);

    useEffect(() => {
        hydrateLearningFromCloud().catch(() => undefined);
        const plan = getOnboardingPlan();
        const preferred = plan?.subjects?.find((s) => s.type === "language");
        if (preferred?.id && ["korean", "english", "japanese", "chinese"].includes(preferred.id)) {
            setSelectedSubject(preferred.id as (typeof subjects)[number]["id"]);
        }
    }, []);

    useEffect(() => {
        setQuiz(pickRandom(letterQuizzes[selectedSubject]));
        setQuizFeedback(null);
    }, [selectedSubject]);

    const sendLearningStarter = (mode: (typeof foundationModes)[number]["id"]) => {
        const subjectLabel = subjects.find((s) => s.id === selectedSubject)?.name ?? "한국어";
        if (mode === "letters") return sendMessage(`${subjectLabel} 문자/발음 기초 퀴즈를 5문제 시작해 주세요.`);
        if (mode === "vocab") return sendMessage(`${subjectLabel} 초급 핵심 단어 20개를 예문과 함께 주세요.`);
        return sendMessage(`${subjectLabel} 문장 패턴(자기소개/요청/의견) 연습을 단계별로 진행해 주세요.`);
    };

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

                if (data.fallback) {
                    setConnectionState("unstable");
                    setLastFailedText(text.trim());
                } else {
                    setConnectionState("ok");
                    setSessionXP((v) => v + 5);
                    addStudyEvent({ kind: "chat", subject: selectedSubject, at: new Date().toISOString() });
                    syncLearningToCloud().catch(() => undefined);
                }
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
            setMessages((prev) => [
                ...prev,
                {
                    id: updatedMessages.length + 1,
                    role: "ai",
                    text: "⚠️ 응답이 지연되거나 연결이 끊겼어요. 아래 '다시 보내기'를 눌러 재시도해 주세요.",
                    timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const addWord = () => {
        const w = wordInput.trim();
        if (!w || savedWords.includes(w)) return;
        setSavedWords((prev) => [w, ...prev]);
        setWordInput("");
    };

    const markMastered = (w: string) => {
        if (!masteredWords.includes(w)) setMasteredWords((prev) => [w, ...prev]);
        setSessionXP((v) => v + 2);
    };

    const markWrong = (w: string) => {
        if (!wrongNotes.includes(w)) setWrongNotes((prev) => [w, ...prev]);
    };

    const togglePattern = (p: string) => {
        setPatternDone((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
        setSessionXP((v) => v + 1);
    };

    const onQuizChoice = (choice: string) => {
        const ok = choice === quiz.answer;
        setQuizFeedback(ok ? "정답이에요! 🎉" : `오답이에요. 정답: ${quiz.answer}`);
        if (ok) setSessionXP((v) => v + 3);
    };

    return (
        <div className="h-[calc(100dvh-56px-84px)] lg:h-screen flex flex-col relative">
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-lg">🤖</div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">AI Teacher Lee</div>
                    <div className={`text-xs flex items-center gap-1 ${connectionState === "ok" ? "text-[var(--secondary)]" : "text-amber-300"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${connectionState === "ok" ? "bg-[var(--secondary)] animate-pulse" : "bg-amber-300"}`} />
                        {connectionState === "ok" ? "온라인" : "재연결 중"}
                        <span className="ml-2 text-[var(--text-muted)]">· 현재 과목: {subjects.find((s) => s.id === selectedSubject)?.name}</span>
                    </div>
                </div>

                <div className="hidden sm:flex gap-1">
                    {subjects.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSubject(s.id)}
                            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${selectedSubject === s.id
                                ? "bg-[var(--primary)]/20 text-[var(--primary-light)] border-[var(--primary)]/40"
                                : "text-[var(--text-muted)] border-transparent hover:border-[var(--border-light)] hover:text-[var(--text-secondary)]"
                                }`}
                            title={s.name}
                        >
                            {s.short}
                        </button>
                    ))}
                </div>
            </div>

            <div className="shrink-0 mx-3 sm:mx-4 lg:mx-6 mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/40 px-3 py-2">
                <div className="flex flex-wrap gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => setLearningMode("free")}
                        className={`text-xs px-3 py-1.5 rounded-full border ${learningMode === "free" ? "border-[var(--primary)]/40 bg-[var(--primary)]/15 text-[var(--primary-light)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}
                    >
                        💬 자유 대화
                    </button>
                    {foundationModes.map((mode) => (
                        <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                                setLearningMode(mode.id);
                                sendLearningStarter(mode.id);
                            }}
                            className={`text-xs px-3 py-1.5 rounded-full border ${learningMode === mode.id ? "border-[var(--secondary)]/40 bg-[var(--secondary)]/15 text-[var(--text-primary)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}
                        >
                            {mode.icon} {mode.label}
                        </button>
                    ))}
                </div>

                {learningMode !== "free" && (
                    <p className="text-[11px] text-[var(--text-muted)] mb-2">
                        {foundationModes.find((m) => m.id === learningMode)?.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] px-2 py-1 rounded-lg bg-[var(--bg-primary)] text-[var(--text-muted)]">세션 XP: {sessionXP}</span>
                    {badges.map((b) => (
                        <span key={b} className="text-[11px] px-2 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary-light)]">{b}</span>
                    ))}
                </div>
            </div>

            {learningMode === "letters" && (
                <div className="shrink-0 mx-3 sm:mx-4 lg:mx-6 mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3">
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">문자 퀴즈</p>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">{quiz.q}</p>
                    <div className="flex flex-wrap gap-2">
                        {quiz.choices.map((c) => (
                            <button key={c} type="button" onClick={() => onQuizChoice(c)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/40">
                                {c}
                            </button>
                        ))}
                        <button type="button" onClick={() => { setQuiz(pickRandom(letterQuizzes[selectedSubject])); setQuizFeedback(null); }} className="text-xs px-2.5 py-1.5 rounded-lg border border-[var(--secondary)]/40 text-[var(--secondary)]">다음 문제</button>
                    </div>
                    {quizFeedback && <p className="text-xs mt-2 text-[var(--text-secondary)]">{quizFeedback}</p>}
                </div>
            )}

            {learningMode === "vocab" && (
                <div className="shrink-0 mx-3 sm:mx-4 lg:mx-6 mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3">
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">단어장</p>
                    <div className="flex gap-2 mb-2">
                        <input value={wordInput} onChange={(e) => setWordInput(e.target.value)} placeholder="단어 입력" className="flex-1 h-9 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] px-3 text-xs" />
                        <button type="button" onClick={addWord} className="text-xs px-3 rounded-lg bg-[var(--primary)] text-white">추가</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {savedWords.slice(0, 12).map((w) => (
                            <span key={w} className="text-xs px-2 py-1 rounded-lg border border-[var(--border)]">
                                {w}
                                <button onClick={() => markMastered(w)} className="ml-1 text-[10px] text-emerald-400">암기</button>
                                <button onClick={() => markWrong(w)} className="ml-1 text-[10px] text-amber-300">오답</button>
                            </span>
                        ))}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">암기 완료 {masteredWords.length}개 · 오답노트 {wrongNotes.length}개</p>
                </div>
            )}

            {learningMode === "patterns" && (
                <div className="shrink-0 mx-3 sm:mx-4 lg:mx-6 mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3">
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">문장 패턴 진도</p>
                    <div className="h-2 rounded-full bg-[var(--bg-primary)] mb-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" style={{ width: `${patternProgress}%` }} />
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mb-2">{patternProgress}% 완료</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                        {patternTemplates.map((p) => (
                            <button key={p} onClick={() => togglePattern(p)} className={`text-xs px-2 py-2 rounded-lg border text-left ${patternDone.includes(p) ? "border-emerald-400/40 bg-emerald-500/10" : "border-[var(--border)]"}`}>
                                {patternDone.includes(p) ? "✅" : "⬜"} {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {connectionState === "unstable" && (
                <div className="shrink-0 mx-3 sm:mx-4 lg:mx-6 mt-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-amber-200">연결이 불안정합니다. <a href="/api/chat/health" target="_blank" className="underline">진단 보기</a></p>
                    {lastFailedText && <button onClick={() => sendMessage(lastFailedText)} disabled={isTyping} className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-400/20">다시 보내기</button>}
                </div>
            )}

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                        {msg.role === "ai" && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs shrink-0 mt-1">AI</div>}
                        <div className="max-w-lg">
                            <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${msg.role === "user" ? "bg-[var(--primary)] text-white rounded-tr-sm" : "glass rounded-tl-sm text-[var(--text-primary)]"}`}>
                                {msg.text}
                            </div>
                            <div className={`text-[10px] text-[var(--text-muted)] mt-1 ${msg.role === "user" ? "text-right" : ""}`}>{msg.timestamp}</div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs shrink-0">AI</div>
                        <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">...</div>
                    </div>
                )}
            </div>

            <div className="shrink-0 px-3 sm:px-4 lg:px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                {quickReplies.map((qr) => (
                    <button key={qr} onClick={() => sendMessage(qr)} className="shrink-0 glass rounded-full min-h-11 px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--primary-light)] whitespace-nowrap">
                        {qr}
                    </button>
                ))}
            </div>

            <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]/30 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                <div className="flex gap-2 items-end max-w-4xl mx-auto">
                    <button className="w-11 h-11 rounded-full glass flex items-center justify-center text-lg text-[var(--text-muted)]">🎤</button>
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
                            className="w-full min-h-11 max-h-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl px-4 py-3 pr-12 text-sm"
                        />
                    </div>
                    <button onClick={() => sendMessage(input)} disabled={isTyping} className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white disabled:opacity-50">
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
