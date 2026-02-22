export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)]">
            {/* Final CTA */}
            <div className="py-20 text-center relative overflow-hidden">
                <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
                <div className="relative z-10 max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        지금 시작하면{" "}
                        <span className="gradient-text">Premium 7일 무료</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                        5,000명의 학습자와 함께 AI 선생님과 배워보세요
                    </p>
                    <button className="btn-primary text-lg !py-4 !px-10 animate-pulse-glow">
                        무료로 시작하기 →
                    </button>
                    <p className="text-xs text-[var(--text-muted)] mt-4">
                        신용카드 불필요 · 3분 만에 시작 · 언제든 해지
                    </p>
                </div>
            </div>

            {/* Footer Links */}
            <div className="border-t border-[var(--border)] py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xs">
                                T.L
                            </div>
                            <span className="text-base font-bold text-[var(--text-primary)]">
                                Teacher<span className="text-[var(--primary-light)]">.Lee</span>
                            </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
                            AI 강사와 함께 언어와 프로그래밍을 배우는 혁신적 교육 플랫폼
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Product</h4>
                        <ul className="space-y-2.5">
                            {["AI 대화 학습", "코딩 학습", "시험 대비", "요금제"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            {["About Us", "Blog", "Careers", "Contact"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            {["이용약관", "개인정보처리방침", "쿠키 정책", "환불 정책"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--border)] py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[var(--text-muted)]">
                        © 2026 Teacher.Lee. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {[
                            { label: "Twitter", icon: "𝕏" },
                            { label: "YouTube", icon: "▶" },
                            { label: "Discord", icon: "💬" },
                            { label: "GitHub", icon: "⌨" },
                        ].map((social) => (
                            <a
                                key={social.label}
                                href="#"
                                className="w-8 h-8 rounded-full glass flex items-center justify-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--primary)]/50 transition-all"
                                title={social.label}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
