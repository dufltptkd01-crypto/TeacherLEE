"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addStudyEvent, getOnboardingPlan } from "@/lib/learning/clientStore";

const exams = [
    { id: "topik1", subject: "korean", name: "TOPIK I", flag: "🇰🇷", desc: "초급 한국어 능력 시험", levels: "1~2급", questions: 70, time: "100분", cta: "from-[var(--primary)] to-[var(--primary-light)]" },
    { id: "topik2", subject: "korean", name: "TOPIK II", flag: "🇰🇷", desc: "중·고급 한국어 능력 시험", levels: "3~6급", questions: 104, time: "180분", cta: "from-[var(--primary)] to-[var(--secondary)]" },
    { id: "jlpt_n3", subject: "japanese", name: "JLPT N3", flag: "🇯🇵", desc: "일본어 능력 시험 N3", levels: "N3", questions: 95, time: "140분", cta: "from-[var(--secondary)] to-[var(--primary-light)]" },
    { id: "hsk4", subject: "chinese", name: "HSK 4급", flag: "🇨🇳", desc: "중국어 수준 시험 4급", levels: "4급", questions: 100, time: "105분", cta: "from-[var(--accent)] to-[var(--primary)]" },
    { id: "toeic", subject: "english", name: "TOEIC LC+RC", flag: "🇺🇸", desc: "영어 듣기·읽기 실전 모의", levels: "700+", questions: 200, time: "120분", cta: "from-[var(--primary-light)] to-[var(--secondary)]" },
];

export default function ExamPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const plan = useMemo(() => getOnboardingPlan(), []);
    const preferredLangs = useMemo(
        () => new Set((plan?.subjects ?? []).filter((s) => s.type === "language").map((s) => s.id)),
        [plan]
    );

    const visibleExams = useMemo(() => {
        if (!preferredLangs.size) return exams;
        const filtered = exams.filter((e) => preferredLangs.has(e.subject));
        return filtered.length ? filtered : exams;
    }, [preferredLangs]);

    const recentAttempts = useMemo(() => {
        if (typeof window === "undefined") return [];
        const attempts = JSON.parse(localStorage.getItem("teacherlee:study-events") || "[]")
            .filter((e: { kind: string; at: string; meta?: { examName?: string } }) => e.kind === "exam")
            .slice(-3)
            .reverse();
        return attempts;
    }, []);

    const startExam = (exam: (typeof exams)[number]) => {
        addStudyEvent({
            kind: "exam",
            subject: exam.subject,
            at: new Date().toISOString(),
            meta: { examId: exam.id, examName: exam.name },
        });
        router.push(`/dashboard/chat?mode=exam&exam=${exam.id}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 pb-6 lg:pb-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">📝 시험 대비</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {preferredLangs.size
                        ? "온보딩에서 선택한 언어 중심으로 시험을 먼저 보여드려요"
                        : "AI가 출제하는 모의시험으로 실전 감각을 키우세요"}
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {visibleExams.map((exam) => (
                    <div
                        key={exam.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelected(exam.id)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelected(exam.id);
                        }}
                        className={`glass rounded-2xl p-5 sm:p-6 text-left card-hover transition-all cursor-pointer ${
                            selected === exam.id ? "ring-2 ring-[var(--primary)]" : ""
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{exam.flag}</span>
                            <div>
                                <h3 className="text-base font-bold text-[var(--text-primary)]">{exam.name}</h3>
                                <p className="text-xs text-[var(--text-muted)]">{exam.desc}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                            <span>📋 {exam.questions}문제</span>
                            <span>⏱ {exam.time}</span>
                            <span>📊 {exam.levels}</span>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                startExam(exam);
                            }}
                            className={`mt-4 w-full text-white rounded-full py-2 text-xs font-semibold bg-gradient-to-r ${exam.cta}`}
                        >
                            모의시험 시작 →
                        </button>
                    </div>
                ))}
            </div>

            <div className="glass rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">📊 최근 시험 기록</h2>
                <div className="space-y-3">
                    {recentAttempts.length > 0 ? (
                        recentAttempts.map((a: { at: string; meta?: { examName?: string } }, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-[var(--text-primary)]">{a.meta?.examName ?? "시험"}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{new Date(a.at).toLocaleString("ko-KR")}</div>
                                </div>
                                <div className="text-xs text-[var(--secondary)]">기록됨</div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-[var(--text-muted)]">아직 응시한 시험이 없습니다. 위에서 첫 시험을 시작해보세요.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
