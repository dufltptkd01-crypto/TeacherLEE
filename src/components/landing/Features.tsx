"use client";

import { useEffect, useRef, useState } from "react";

const features = [
    {
        icon: "🗣️",
        title: "실시간 AI 대화",
        subtitle: "Adaptive Real-Time Conversation",
        description:
            "AI가 당신의 수준을 실시간 분석하여 난이도와 주제를 자동 조절합니다. 음성 & 텍스트로 자유롭게 대화하며 문법, 발음, 어휘를 동시에 학습하세요.",
        highlights: ["음성/텍스트 자유 대화", "발음 분석 & 교정", "문화적 뉘앙스 피드백"],
        gradient: "from-[var(--primary)] to-[var(--primary-light)]",
        bgGlow: "rgba(79, 70, 229, 0.1)",
    },
    {
        icon: "💻",
        title: "AI 코드 리뷰",
        subtitle: "Code Review + Language Feedback",
        description:
            "직접 코드를 작성하고 AI에게 리뷰를 받으세요. 로직 오류, 베스트 프랙티스는 물론 코드 주석까지 학습 언어로 작성하는 크로스 도메인 학습.",
        highlights: ["라인별 코드 리뷰", "코딩 + 언어 동시 학습", "실시간 샌드박스 IDE"],
        gradient: "from-[var(--secondary)] to-[var(--secondary-light)]",
        bgGlow: "rgba(16, 185, 129, 0.1)",
    },
    {
        icon: "📊",
        title: "맞춤형 AI 커리큘럼",
        subtitle: "Cross-Domain Learning Path",
        description:
            "레벨 테스트 결과와 학습 이력을 분석하여 당신만의 학습 경로를 AI가 자동 설계합니다. 한국어 웹사이트 만들기 같은 융합 과제도 제공.",
        highlights: ["AI 기반 레벨 측정", "취약점 자동 분석", "시험 대비 최적화"],
        gradient: "from-[var(--accent)] to-[var(--accent-light)]",
        bgGlow: "rgba(245, 158, 11, 0.1)",
    },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`glass rounded-2xl p-8 card-hover relative overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Glow */}
            <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: feature.bgGlow }}
            />

            <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                    {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{feature.title}</h3>
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4">
                    {feature.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                    {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                    {feature.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${feature.gradient}`} />
                            {h}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function Features() {
    return (
        <section id="features" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--primary)]/10 text-[var(--primary-light)] mb-4">
                        Core Features
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        기존 플랫폼과는 <span className="gradient-text">차원이 다릅니다</span>
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        단순 드릴이 아닌, AI가 당신의 학습 여정을 실시간으로 함께합니다
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <FeatureCard key={f.title} feature={f} index={i} />
                    ))}
                </div>

                {/* Language Tags */}
                <div className="flex flex-wrap justify-center gap-3 mt-12">
                    {["🇰🇷 한국어", "🇺🇸 English", "🇯🇵 日本語", "🇨🇳 中文", "💻 HTML", "⚡ JavaScript"].map(
                        (tag) => (
                            <span
                                key={tag}
                                className="glass rounded-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)]/50 transition-all cursor-default"
                            >
                                {tag}
                            </span>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}
