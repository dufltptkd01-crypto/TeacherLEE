"use client";

import { useMemo, useState } from "react";
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
    const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({});
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const selectedSubjects = useMemo(() => {
        const langSubjects = selectedLangs.map((id) => {
            const found = languages.find((l) => l.id === id)!;
            return { id: found.id, type: "language", title: found.name, subtitle: found.eng, icon: found.flag };
        });
        const progSubjects = selectedProg.map((id) => {
            const found = programmingTopics.find((p) => p.id === id)!;
            return { id: found.id, type: "programming", title: found.name, subtitle: found.desc, icon: found.icon };
        });
        return [...langSubjects, ...progSubjects];
    }, [selectedLangs, selectedProg]);

    const toggleItem = (
        arr: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        id: string
    ) => {
        setter(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
    };

    const toggleSubject = (group: "lang" | "prog", id: string) => {
        if (group === "lang") {
            const next = selectedLangs.includes(id)
                ? selectedLangs.filter((x) => x !== id)
                : [...selectedLangs, id];
            setSelectedLangs(next);
            if (!next.includes(id)) {
                setSelectedLevels((prev) => {
                    const clone = { ...prev };
                    delete clone[id];
                    return clone;
                });
            }
            return;
        }

        const next = selectedProg.includes(id)
            ? selectedProg.filter((x) => x !== id)
            : [...selectedProg, id];
        setSelectedProg(next);
        if (!next.includes(id)) {
            setSelectedLevels((prev) => {
                const clone = { ...prev };
                delete clone[id];
                return clone;
            });
        }
    };

    const totalSteps = 4;
    const progress = ((step + 1) / totalSteps) * 100;

    const canProceed =
        (step === 0 && selectedSubjects.length > 0) ||
        (step === 1 && selectedSubjects.length > 0 && selectedSubjects.every((s) => !!selectedLevels[s.id])) ||
        (step === 2 && selectedGoals.length > 0) ||
        step === 3;

    return (
        <div className="min-h-screen flex items-start sm:items-center justify-center relative hero-grid px-3 sm:px-6 py-8 sm:py-12">
            <div className="hero-glow -top-40 -left-20" />

            <div className="w-full max-w-xl relative z-10">
                <div className="flex items-center gap-2.5 justify-center mb-5 sm:mb-6">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xs">
                        T.L
                    </div>
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                        Teacher<span className="text-[var(--primary-light)]">.Lee</span>
                    </span>
                </div>

                <div className="mb-6 sm:mb-8 px-1">
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
                        <span>단계 {step + 1} / {totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-secondary)]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="glass rounded-2xl p-5 sm:p-8 animate-fade-in" key={step}>
                    {step === 0 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-[clamp(1.85rem,8.4vw,2.3rem)] font-bold text-[var(--text-primary)] mb-2 leading-[1.18] break-keep">
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
                                            onClick={() => toggleSubject("lang", l.id)}
                                            className={`flex items-center gap-2.5 p-3.5 rounded-xl border transition-all ${selectedLangs.includes(l.id)
                                                ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-[var(--shadow-glow)]"
                                                : "border-[var(--border)] hover:border-[var(--border-light)]"
                                                }`}
                                        >
                                            <span className="text-xl sm:text-2xl">{l.flag}</span>
                                            <div className="text-left min-w-0">
                                                <div className="text-base sm:text-sm font-semibold text-[var(--text-primary)] truncate">{l.name}</div>
                                                <div className="text-xs text-[var(--text-muted)] truncate">{l.eng}</div>
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
                                            onClick={() => toggleSubject("prog", p.id)}
                                            className={`flex items-center gap-2.5 p-3.5 rounded-xl border transition-all ${selectedProg.includes(p.id)
                                                ? "border-[var(--secondary)] bg-[var(--secondary)]/10"
                                                : "border-[var(--border)] hover:border-[var(--border-light)]"
                                                }`}
                                        >
                                            <span className="text-xl sm:text-2xl">{p.icon}</span>
                                            <div className="text-left min-w-0">
                                                <div className="text-base sm:text-sm font-semibold text-[var(--text-primary)] truncate">{p.name}</div>
                                                <div className="text-xs text-[var(--text-muted)] leading-tight">{p.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-[clamp(1.85rem,8.4vw,2.3rem)] font-bold text-[var(--text-primary)] mb-2 leading-[1.18] break-keep">
                                    현재 실력은 어느 정도인가요?
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    선택한 과목별로 레벨을 고르면 AI가 맞춤 커리큘럼을 구성해요
                                </p>
                            </div>

                            <div className="space-y-4">
                                {selectedSubjects.map((subject) => (
                                    <div key={subject.id} className="rounded-xl border border-[var(--border)] p-3.5 sm:p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg">{subject.icon}</span>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-[var(--text-primary)]">{subject.title}</div>
                                                <div className="text-xs text-[var(--text-muted)] truncate">{subject.subtitle}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {levels.map((l) => {
                                                const active = selectedLevels[subject.id] === l.id;
                                                return (
                                                    <button
                                                        key={`${subject.id}-${l.id}`}
                                                        onClick={() => setSelectedLevels((prev) => ({ ...prev, [subject.id]: l.id }))}
                                                        className={`rounded-lg border px-3 py-2 text-left transition-all ${active
                                                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                                            : "border-[var(--border)] hover:border-[var(--border-light)]"
                                                            }`}
                                                    >
                                                        <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                                                            <span>{l.icon}</span>
                                                            <span>{l.label}</span>
                                                        </div>
                                                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{l.desc}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-[clamp(1.85rem,8.4vw,2.3rem)] font-bold text-[var(--text-primary)] mb-2 leading-[1.18] break-keep">
                                    학습 목표는 무엇인가요?
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)]">해당되는 것을 모두 선택하세요</p>
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
                                        <span className="text-xs font-medium text-[var(--text-primary)] break-keep">
                                            {g.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-6 py-2 sm:py-4 overflow-hidden">
                            <div className="text-5xl mb-2">🎉</div>
                            <h2 className="text-[clamp(1.8rem,8vw,2.2rem)] font-bold text-[var(--text-primary)] leading-[1.15] break-keep px-1">
                                준비가 완료되었습니다!
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto break-keep">
                                AI가 당신만의 맞춤 커리큘럼을 생성 중입니다.
                                지금 바로 학습을 시작하세요!
                            </p>

                            <div className="glass rounded-xl p-4 text-left space-y-3 max-w-md mx-auto">
                                <div className="flex items-start gap-2 text-sm">
                                    <span className="text-[var(--secondary)] mt-0.5">✓</span>
                                    <span className="text-[var(--text-secondary)] break-keep">
                                        선택 과목: {selectedSubjects.map((s) => `${s.icon} ${s.title}`).join(" · ")}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                    <span className="text-[var(--secondary)] mt-0.5">✓</span>
                                    <span className="text-[var(--text-secondary)] break-keep">
                                        과목별 레벨: {selectedSubjects.map((s) => {
                                            const levelLabel = levels.find((l) => l.id === selectedLevels[s.id])?.label ?? "미선택";
                                            return `${s.title}(${levelLabel})`;
                                        }).join(" · ")}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                    <span className="text-[var(--secondary)] mt-0.5">✓</span>
                                    <span className="text-[var(--text-secondary)]">목표: {selectedGoals.length}개 선택</span>
                                </div>
                            </div>
                        </div>
                    )}

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
                                className={`btn-primary flex-1 justify-center ${!canProceed ? "opacity-40 cursor-not-allowed" : ""}`}
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
