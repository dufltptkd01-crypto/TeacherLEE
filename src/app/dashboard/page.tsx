"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getOnboardingPlan, getStudyEvents, hydrateLearningFromCloud } from "@/lib/learning/clientStore";

const levelLabel: Record<string, string> = {
    beginner: "완전 초보",
    elementary: "초급",
    intermediate: "중급",
    advanced: "고급",
};



export default function DashboardPage() {
    const [plan, setPlan] = useState(() => getOnboardingPlan());
    const [events, setEvents] = useState(() => getStudyEvents());
    const [nowTs, setNowTs] = useState(() => Date.now());

    useEffect(() => {
        hydrateLearningFromCloud()
            .catch(() => undefined)
            .finally(() => {
                setPlan(getOnboardingPlan());
                setEvents(getStudyEvents());
                setNowTs(Date.now());
            });
    }, []);

    const totalXP = useMemo(() => events.length * 5, [events]);
    const targetXP = 50;

    const activeCourses = useMemo(() => {
        if (!plan?.subjects?.length) return [];


        return plan.subjects.map((s, index) => ({
            name: `${s.title} ${levelLabel[s.level] ?? "입문"}`,
            flag: s.icon,
            progress: Math.max(18, 72 - index * 14),
            level: levelLabel[s.level] ?? "입문",
        }));
    }, [plan]);

    const todayMissions = useMemo(() => {
        if (!plan?.subjects?.length) {
            return [
                { id: 1, title: "온보딩을 완료하면 맞춤 미션이 생성됩니다", subject: "🧭", done: false, xp: 0 },
            ];
        }

        const today = new Date().toDateString();
        const todayEvents = events.filter((e) => new Date(e.at).toDateString() === today);

        return plan.subjects.slice(0, 4).map((s, index) => {
            const level = levelLabel[s.level] ?? "입문";
            const title =
                s.type === "programming"
                    ? `${s.title} ${level} 실습 ${index + 1}`
                    : `${s.title} ${level} 회화 연습 10분`;
            const done = todayEvents.some((e) => e.subject === s.id);
            return {
                id: index + 1,
                title,
                subject: s.icon,
                done,
                xp: 10 + index * 3,
            };
        });
    }, [plan, events]);

    const uniqueDays = new Set(events.map((e) => new Date(e.at).toDateString())).size;
    const totalLifetimeXP = events.length * 5;
    const weeklyEventCount = events.filter((e) => nowTs - new Date(e.at).getTime() < 7 * 24 * 60 * 60 * 1000).length;

    const weeklyStats = [
        { label: "학습 시간", value: `${(weeklyEventCount * 8 / 60).toFixed(1)}h`, change: "실측", up: true },
        { label: "AI 대화", value: `${events.filter((e) => e.kind === "chat").length}회`, change: "실측", up: true },
        { label: "코드 제출", value: `${events.filter((e) => e.kind === "code").length}회`, change: "실측", up: true },
        { label: "정확도", value: "측정중", change: "-", up: true },
    ];

    const recentFeedback = events.length
        ? [
            { type: "success", text: `이번 주 학습 활동 ${weeklyEventCount}회 기록됨`, subject: "📈" },
            { type: "info", text: `가장 최근 학습: ${new Date(events[events.length - 1].at).toLocaleString("ko-KR")}`, subject: "🕒" },
          ]
        : [{ type: "info", text: "아직 학습 기록이 없습니다. AI 대화부터 시작해 보세요.", subject: "🧭" }];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 pb-6 lg:pb-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        안녕하세요! 👋
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {plan?.subjects?.length
                            ? `선택한 ${plan.subjects.length}개 과목 기준으로 오늘 미션을 준비했어요`
                            : "오늘도 열심히 공부해봐요"}
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3">
                    <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm">
                        <span>🔥</span>
                        <span className="font-bold text-[var(--accent)]">{uniqueDays}</span>
                        <span className="text-[var(--text-muted)]">학습 일수</span>
                    </div>
                    <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm">
                        <span>⭐</span>
                        <span className="font-bold text-[var(--text-primary)]">{totalLifetimeXP}</span>
                        <span className="text-[var(--text-muted)]">누적 XP</span>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                        오늘의 학습
                    </h2>
                    <span className="text-xs text-[var(--text-muted)]">
                        {totalXP}/{targetXP} XP
                    </span>
                </div>
                <div className="h-3 rounded-full bg-[var(--bg-primary)] mb-4">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all"
                        style={{ width: `${(totalXP / targetXP) * 100}%` }}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {activeCourses.length > 0 ? activeCourses.map((c) => (
                        <span
                            key={c.name}
                            className="glass rounded-full px-3 py-1 text-xs flex items-center gap-1.5"
                        >
                            <span>{c.flag}</span>
                            <span className="text-[var(--text-secondary)]">{c.name}</span>
                            <span className="text-[var(--text-muted)]">{c.progress}%</span>
                        </span>
                    )) : (
                        <span className="text-xs text-[var(--text-muted)]">온보딩을 완료하면 과목이 표시됩니다.</span>
                    )}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Missions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Missions */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                            📋 오늘의 미션
                        </h2>
                        <div className="space-y-3">
                            {todayMissions.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl border transition-all ${m.done
                                            ? "border-[var(--secondary)]/30 bg-[var(--secondary)]/5"
                                            : "border-[var(--border)] hover:border-[var(--border-light)]"
                                        }`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${m.done
                                                ? "bg-[var(--secondary)] text-white"
                                                : "border border-[var(--border)]"
                                            }`}
                                    >
                                        {m.done ? "✓" : ""}
                                    </div>
                                    <span className="text-lg">{m.subject}</span>
                                    <span
                                        className={`text-sm flex-1 ${m.done
                                                ? "text-[var(--text-muted)] line-through"
                                                : "text-[var(--text-primary)]"
                                            }`}
                                    >
                                        {m.title}
                                    </span>
                                    <span className="text-[11px] sm:text-xs text-[var(--accent)] font-semibold">
                                        +{m.xp} XP
                                    </span>
                                    {!m.done && (
                                        <Link
                                            href="/dashboard/chat"
                                            className="text-[11px] sm:text-xs text-[var(--primary-light)] font-medium hover:underline whitespace-nowrap"
                                        >
                                            시작 →
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Stats */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                            📈 주간 통계
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {weeklyStats.map((s) => (
                                <div key={s.label} className="text-center">
                                    <div className="text-xl font-bold text-[var(--text-primary)]">
                                        {s.value}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
                                    <div
                                        className={`text-xs font-medium mt-1 ${s.up ? "text-[var(--secondary)]" : "text-red-400"
                                            }`}
                                    >
                                        {s.up ? "↑" : "↓"} {s.change}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Activity Heatmap */}
                        <div className="mt-4 pt-4 border-t border-[var(--border)]">
                            <div className="flex justify-between">
                                {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => (
                                    <div key={d} className="flex flex-col items-center gap-1">
                                        <div
                                            className="w-8 h-8 rounded-lg"
                                            style={{
                                                background:
                                                    i < 5
                                                        ? `rgba(79, 70, 229, ${0.2 + i * 0.15})`
                                                        : "var(--bg-primary)",
                                            }}
                                        />
                                        <span className="text-[10px] text-[var(--text-muted)]">{d}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                            ⚡ 빠른 시작
                        </h2>
                        <div className="space-y-2">
                            <Link
                                href="/dashboard/chat"
                                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all"
                            >
                                <span className="text-lg">🗣️</span>
                                <span className="text-sm text-[var(--text-primary)]">
                                    AI와 대화하기
                                </span>
                            </Link>
                            <Link
                                href="/dashboard/code"
                                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--secondary)]/50 hover:bg-[var(--secondary)]/5 transition-all"
                            >
                                <span className="text-lg">💻</span>
                                <span className="text-sm text-[var(--text-primary)]">
                                    코드 작성하기
                                </span>
                            </Link>
                            <Link
                                href="/dashboard/exam"
                                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all"
                            >
                                <span className="text-lg">📝</span>
                                <span className="text-sm text-[var(--text-primary)]">
                                    모의시험 풀기
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Feedback */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                            💡 최근 피드백
                        </h2>
                        <div className="space-y-3">
                            {recentFeedback.map((f, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span
                                        className={`text-xs mt-0.5 ${f.type === "warning"
                                                ? "text-[var(--accent)]"
                                                : f.type === "success"
                                                    ? "text-[var(--secondary)]"
                                                    : "text-[var(--primary-light)]"
                                            }`}
                                    >
                                        {f.type === "warning" ? "⚠️" : f.type === "success" ? "✅" : "💡"}
                                    </span>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                        {f.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-xs text-[var(--primary-light)] font-medium hover:underline">
                            📊 취약점 분석 →
                        </button>
                    </div>

                    {/* Courses Progress */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                            📚 학습 중인 과목
                        </h2>
                        <div className="space-y-4">
                            {activeCourses.map((c) => (
                                <div key={c.name}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                                            {c.flag} {c.name}
                                        </span>
                                        <span className="text-xs text-[var(--text-muted)]">
                                            {c.progress}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-[var(--bg-primary)]">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all"
                                            style={{ width: `${c.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
