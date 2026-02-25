export default function ReportPage() {
    const weekData = [
        { day: "월", minutes: 45, conversations: 5 },
        { day: "화", minutes: 30, conversations: 3 },
        { day: "수", minutes: 60, conversations: 8 },
        { day: "목", minutes: 20, conversations: 2 },
        { day: "금", minutes: 50, conversations: 6 },
        { day: "토", minutes: 15, conversations: 1 },
        { day: "일", minutes: 0, conversations: 0 },
    ];

    const maxMinutes = Math.max(...weekData.map((d) => d.minutes));

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 pb-6 lg:pb-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    📈 학습 리포트
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    이번 주 학습 통계와 AI 분석 결과
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "총 학습 시간", value: "3.7h", icon: "⏱", change: "+18%" },
                    { label: "AI 대화 수", value: "25회", icon: "🗣️", change: "+12%" },
                    { label: "코드 제출", value: "8회", icon: "💻", change: "+25%" },
                    { label: "평균 정확도", value: "76%", icon: "🎯", change: "+3%" },
                ].map((s) => (
                    <div key={s.label} className="glass rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{s.icon}</span>
                            <span className="text-xs font-medium text-[var(--secondary)]">
                                {s.change}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                            {s.value}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Weekly Chart */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-6">
                    📊 일별 학습 시간
                </h2>
                <div className="overflow-x-auto">
                    <div className="flex items-end gap-3 h-40 min-w-[420px]">
                        {weekData.map((d) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-[10px] text-[var(--text-muted)]">{d.minutes}분</span>
                                <div
                                    className="w-full max-w-10 rounded-t-lg bg-[var(--bg-primary)] relative"
                                    style={{ height: "100%" }}
                                >
                                    <div
                                        className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-[var(--primary)] to-[var(--primary-light)] transition-all"
                                        style={{
                                            height: maxMinutes > 0 ? `${(d.minutes / maxMinutes) * 100}%` : "0%",
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                    🧠 AI 분석 인사이트
                </h2>
                <div className="space-y-3">
                    {[
                        {
                            type: "strength",
                            icon: "💪",
                            text: "어휘력이 꾸준히 성장하고 있어요. 이번 주 새로운 단어 47개를 학습했습니다.",
                        },
                        {
                            type: "weakness",
                            icon: "📌",
                            text: "한국어 조사(을/를, 이/가) 사용에서 혼동이 자주 발생합니다. 집중 연습을 추천해요.",
                        },
                        {
                            type: "tip",
                            icon: "💡",
                            text: "매일 10분만 더 투자하면 목표 달성 속도가 30% 빨라질 수 있어요!",
                        },
                    ].map((insight, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)]"
                        >
                            <span className="text-lg">{insight.icon}</span>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {insight.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
