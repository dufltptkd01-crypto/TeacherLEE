"use client";

import { useState } from "react";

const exams = [
    {
        id: "topik1",
        name: "TOPIK I",
        flag: "🇰🇷",
        desc: "초급 한국어 능력 시험",
        levels: "1~2급",
        questions: 70,
        time: "100분",
        color: "var(--primary)",
    },
    {
        id: "topik2",
        name: "TOPIK II",
        flag: "🇰🇷",
        desc: "중·고급 한국어 능력 시험",
        levels: "3~6급",
        questions: 104,
        time: "180분",
        color: "var(--primary-light)",
    },
    {
        id: "jlpt_n3",
        name: "JLPT N3",
        flag: "🇯🇵",
        desc: "일본어 능력 시험 N3",
        levels: "N3",
        questions: 95,
        time: "140분",
        color: "var(--secondary)",
    },
    {
        id: "hsk4",
        name: "HSK 4급",
        flag: "🇨🇳",
        desc: "중국어 수준 시험 4급",
        levels: "4급",
        questions: 100,
        time: "105분",
        color: "var(--accent)",
    },
];

const recentAttempts = [
    { exam: "TOPIK I 모의 #3", score: "82/100", date: "2일 전", trend: "↑" },
    { exam: "JLPT N3 독해", score: "65/100", date: "4일 전", trend: "↑" },
    { exam: "TOPIK I 모의 #2", score: "76/100", date: "1주 전", trend: "→" },
];

export default function ExamPage() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="p-6 lg:p-8 space-y-6 pb-24 lg:pb-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">📝 시험 대비</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    AI가 출제하는 모의시험으로 실전 감각을 키우세요
                </p>
            </div>

            {/* Exam Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
                {exams.map((exam) => (
                    <button
                        key={exam.id}
                        onClick={() => setSelected(exam.id)}
                        className={`glass rounded-2xl p-6 text-left card-hover transition-all ${selected === exam.id
                                ? "ring-2 ring-[var(--primary)]"
                                : ""
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{exam.flag}</span>
                            <div>
                                <h3 className="text-base font-bold text-[var(--text-primary)]">
                                    {exam.name}
                                </h3>
                                <p className="text-xs text-[var(--text-muted)]">{exam.desc}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                            <span>📋 {exam.questions}문제</span>
                            <span>⏱ {exam.time}</span>
                            <span>📊 {exam.levels}</span>
                        </div>
                        <button
                            className="mt-4 w-full btn-primary text-xs !py-2 justify-center"
                            style={{ background: `linear-gradient(135deg, ${exam.color}, ${exam.color}dd)` }}
                        >
                            모의시험 시작 →
                        </button>
                    </button>
                ))}
            </div>

            {/* Recent Attempts */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                    📊 최근 시험 결과
                </h2>
                <div className="space-y-3">
                    {recentAttempts.map((a, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]"
                        >
                            <div className="flex-1">
                                <div className="text-sm font-medium text-[var(--text-primary)]">
                                    {a.exam}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">{a.date}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-[var(--text-primary)]">
                                    {a.score}
                                </div>
                                <div className="text-xs text-[var(--secondary)]">{a.trend}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
