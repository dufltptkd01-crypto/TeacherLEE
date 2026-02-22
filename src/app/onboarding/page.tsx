"use client";

import { useState } from "react";
import Link from "next/link";

const languages = [
    { id: "korean", flag: "🇰🇷", name: "한국어", eng: "Korean" },
    { id: "english", flag: "🇺🇸", name: "English", eng: "English" },
    { id: "japanese", flag: "🇯🇵", name: "日本語", eng: "Japanese" },
    { id: "chinese", flag: "🇨🇳", name: "中文", eng: "Chinese" },
];

const programmingTopics = [
    { id: "html", icon: "🌐", name: "HTML/CSS", desc: "웹페이지 구조 & 스타일링" },
    { id: "js", icon: "⚡", name: "JavaScript", desc: "인터랙티브 웹 프로그래밍" },
];

const levels = [
    { id: "beginner", label: "완전 초보", desc: "처음 배워요", icon: "🌱" },
    { id: "elementary", label: "초급", desc: "기초를 알아요", icon: "📗" },
    { id: "intermediate", label: "중급", desc: "대화가 가능해요", icon: "📘" },
    { id: "advanced", label: "고급", desc: "유창하게 말해요", icon: "📕" },
];

const goals = [
    { id: "conversation", icon: "🗣️", label: "일상 회화" },
    { id: "exam", icon: "📝", label: "시험 대비 (TOPIK, JLPT, HSK)" },
    { id: "career", icon: "💼", label: "취업 / 비즈니스" },
    { id: "coding", icon: "💻", label: "프로그래밍 학습" },
    { id: "travel", icon: "✈️", label: "여행 준비" },
    { id: "hobby", icon: "🎯", label: "취미 / 문화 이해" },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [selectedProg, setSelectedProg] = useState<string[]>([]);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const toggleItem = (
        arr: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        id: string
    ) => {
        setter(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
    };

    const totalSteps = 4;
    const progress = ((step + 1) / totalSteps) * 100;

    const canProceed =
        (step === 0 && selectedLangs.length > 0) ||
        (step === 1 && selectedLevel !== "") ||
        (step === 2 && selectedGoals.length > 0) ||
        step === 3;

    return (
        <div className="min-h-screen flex items-center justify-center relative hero-grid px-6 py-12">
            <div className="hero-glow -top-40 -left-20" />

            <div className="w-full max-w-lg relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2.5 justify-center mb-6">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xs">
                        T.L
                    </div>
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                        Teacher<span className="text-[var(--primary-light)]">.Lee</span>
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
                        <span>
                            단계 {step + 1} / {totalSteps}
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-secondary)]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-8 animate-fade-in" key={step}>
                    {/* Step 0: Language Selection */}
                    {step === 0 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                    무엇을 배우고 싶으세요?
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    학습하고 싶은 언어와 과목을 선택하세요 (복수 선택 가능)
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                    Languages
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {languages.map((l) => (
                                        <button
                                            key={l.id}
                                            onClick={() => toggleItem(selectedLangs, setSelectedLangs, l.id)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedLangs.includes(l.id)
                                                    ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-[var(--shadow-glow)]"
                                                    : "border-[var(--border)] hover:border-[var(--border-light)]"
                                                }`}
                                        >
                                            <span className="text-2xl">{l.flag}</span>
                                            <div className="text-left">
                                                <div className="text-sm font-semibold text-[var(--text-primary)]">
                                                    {l.name}
                                                </div>
                                                <div className="text-xs text-[var(--text-muted)]">{l.eng}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                    Programming
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {programmingTopics.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => toggleItem(selectedProg, setSelectedProg, p.id)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedProg.includes(p.id)
                                                    ? "border-[var(--secondary)] bg-[var(--secondary)]/10"
                                                    : "border-[var(--border)] hover:border-[var(--border-light)]"
                                                }`}
                                        >
                                            <span className="text-2xl">{p.icon}</span>
                                            <div className="text-left">
                                                <div className="text-sm font-semibold text-[var(--text-primary)]">
                                                    {p.name}
                                                </div>
                                                <div className="text-xs text-[var(--text-muted)]">{p.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Level */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                    현재 실력은 어느 정도인가요?
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    AI가 맞춤 커리큘럼을 만들어 드릴게요
                                </p>
                            </div>

                            <div className="space-y-3">
                                {levels.map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => setSelectedLevel(l.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedLevel === l.id
                                                ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-[var(--shadow-glow)]"
                                                : "border-[var(--border)] hover:border-[var(--border-light)]"
                                            }`}
                                    >
                                        <span className="text-2xl">{l.icon}</span>
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--text-primary)]">
                                                {l.label}
                                            </div>
                                            <div className="text-xs text-[var(--text-muted)]">{l.desc}</div>
                                        </div>
                                        {selectedLevel === l.id && (
                                            <span className="ml-auto text-[var(--primary)] text-lg">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Goals */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                    학습 목표는 무엇인가요?
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    해당되는 것을 모두 선택하세요
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {goals.map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => toggleItem(selectedGoals, setSelectedGoals, g.id)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${selectedGoals.includes(g.id)
                                                ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                                : "border-[var(--border)] hover:border-[var(--border-light)]"
                                            }`}
                                    >
                                        <span className="text-2xl">{g.icon}</span>
                                        <span className="text-xs font-medium text-[var(--text-primary)]">
                                            {g.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Ready */}
                    {step === 3 && (
                        <div className="text-center space-y-6 py-4">
                            <div className="text-5xl mb-2">🎉</div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                준비가 완료되었습니다!
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
                                AI가 당신만의 맞춤 커리큘럼을 생성 중입니다.
                                지금 바로 학습을 시작하세요!
                            </p>

                            <div className="glass rounded-xl p-4 text-left space-y-3 max-w-xs mx-auto">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-[var(--secondary)]">✓</span>
                                    <span className="text-[var(--text-secondary)]">
                                        선택 언어:{" "}
                                        {selectedLangs
                                            .map((l) => languages.find((x) => x.id === l)?.flag)
                                            .join(" ")}
                                        {selectedProg.length > 0 && " 💻"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-[var(--secondary)]">✓</span>
                                    <span className="text-[var(--text-secondary)]">
                                        레벨: {levels.find((l) => l.id === selectedLevel)?.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-[var(--secondary)]">✓</span>
                                    <span className="text-[var(--text-secondary)]">
                                        목표: {selectedGoals.length}개 선택
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 mt-8">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="btn-secondary flex-1 justify-center"
                            >
                                ← 이전
                            </button>
                        )}
                        {step < totalSteps - 1 ? (
                            <button
                                onClick={() => canProceed && setStep(step + 1)}
                                className={`btn-primary flex-1 justify-center ${!canProceed ? "opacity-40 cursor-not-allowed" : ""
                                    }`}
                                disabled={!canProceed}
                            >
                                다음 →
                            </button>
                        ) : (
                            <Link href="/dashboard" className="flex-1">
                                <button className="w-full btn-primary justify-center animate-pulse-glow">
                                    🚀 학습 시작하기
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
