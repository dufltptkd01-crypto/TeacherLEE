"use client";

import Link from "next/link";

const todayMissions = [
    { id: 1, title: "한국어 대화 연습 10분", subject: "🇰🇷", done: false, xp: 15 },
    { id: 2, title: "JS 배열 메서드 퀴즈", subject: "⚡", done: true, xp: 10 },
    { id: 3, title: "TOPIK 읽기 모의고사 1세트", subject: "📝", done: false, xp: 20 },
    { id: 4, title: "HTML 폼 태그 실습", subject: "🌐", done: false, xp: 12 },
];

const weeklyStats = [
    { label: "학습 시간", value: "4.2h", change: "+12%", up: true },
    { label: "AI 대화", value: "23회", change: "+8%", up: true },
    { label: "코드 제출", value: "12회", change: "+15%", up: true },
    { label: "정확도", value: "78%", change: "+5%", up: true },
];

const activeCourses = [
    { name: "한국어 B1", flag: "🇰🇷", progress: 68, level: "B1" },
    { name: "JavaScript 중급", flag: "⚡", progress: 42, level: "중급" },
    { name: "TOPIK II 대비", flag: "📝", progress: 25, level: "시험" },
];

const recentFeedback = [
    { type: "warning", text: "조사 사용 오류 빈발 — '을/를' 혼동 3회", subject: "🇰🇷" },
    { type: "success", text: "어휘력 향상 추세 — 이번 주 +47 단어", subject: "🇰🇷" },
    { type: "info", text: "for 루프 활용도 우수 — 다음: 배열 메서드", subject: "⚡" },
];

export default function DashboardPage() {
    const totalXP = 34;
    const targetXP = 50;

    return (
        <div className="p-6 lg:p-8 space-y-6 pb-24 lg:pb-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        안녕하세요! 👋
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        오늘도 열심히 공부해봐요
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm">
                        <span>🔥</span>
                        <span className="font-bold text-[var(--accent)]">12</span>
                        <span className="text-[var(--text-muted)]">일 연속</span>
                    </div>
                    <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm">
                        <span>⭐</span>
                        <span className="font-bold text-[var(--text-primary)]">1,240</span>
                        <span className="text-[var(--text-muted)]">XP</span>
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
                    {activeCourses.map((c) => (
                        <span
                            key={c.name}
                            className="glass rounded-full px-3 py-1 text-xs flex items-center gap-1.5"
                        >
                            <span>{c.flag}</span>
                            <span className="text-[var(--text-secondary)]">{c.name}</span>
                            <span className="text-[var(--text-muted)]">{c.progress}%</span>
                        </span>
                    ))}
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
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${m.done
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
                                    <span className="text-xs text-[var(--accent)] font-semibold">
                                        +{m.xp} XP
                                    </span>
                                    {!m.done && (
                                        <Link
                                            href="/dashboard/chat"
                                            className="text-xs text-[var(--primary-light)] font-medium hover:underline"
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
