export default function SettingsPage() {
    return (
        <div className="p-6 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">⚙️ 설정</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    계정 및 학습 환경 설정
                </p>
            </div>

            {/* Profile */}
            <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    👤 프로필
                </h2>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] flex items-center justify-center text-white text-xl font-bold">
                        U
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            defaultValue="User"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors mb-2"
                        />
                        <input
                            type="email"
                            defaultValue="user@example.com"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Learning Preferences */}
            <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    📚 학습 설정
                </h2>
                <div className="space-y-3">
                    {[
                        { label: "일일 학습 목표", value: "30분" },
                        { label: "알림 시간", value: "오후 8:00" },
                        { label: "모국어", value: "English" },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)]"
                        >
                            <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                {s.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subscription */}
            <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    💎 구독 관리
                </h2>
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                    <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">
                            Free Plan
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                            AI 대화 10회/일 제한
                        </div>
                    </div>
                    <button className="btn-primary text-xs !py-2 !px-4">
                        업그레이드
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass rounded-2xl p-6 space-y-4 border border-red-500/20">
                <h2 className="text-sm font-semibold text-red-400">⚠️ 계정</h2>
                <div className="flex gap-3">
                    <button className="btn-secondary text-xs !border-red-500/30 !text-red-400 hover:!bg-red-500/10">
                        로그아웃
                    </button>
                    <button className="btn-secondary text-xs !border-red-500/30 !text-red-400 hover:!bg-red-500/10">
                        계정 삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
