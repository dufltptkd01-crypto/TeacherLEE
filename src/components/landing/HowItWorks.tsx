"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
    {
        step: "01",
        icon: "🎯",
        title: "레벨 테스트",
        description: "AI가 짧은 대화와 퀴즈로 당신의 현재 실력을 정확히 측정합니다. 5분이면 충분해요.",
        detail: "언어: CEFR A1~C2 / 코딩: 초급~고급 자동 배치",
        color: "var(--primary)",
    },
    {
        step: "02",
        icon: "🧠",
        title: "AI 커리큘럼 생성",
        description: "테스트 결과와 학습 목표를 분석하여 당신만의 맞춤 학습 경로를 설계합니다.",
        detail: "시험 대비, 취업 준비, 일상 회화 등 목적별 최적화",
        color: "var(--secondary)",
    },
    {
        step: "03",
        icon: "🚀",
        title: "매일 학습 시작",
        description: "AI 강사와 대화하고, 코드를 작성하고, 피드백을 받으세요. 매일 조금씩, 꾸준히.",
        detail: "일일 미션 + 스트릭 시스템으로 동기 부여",
        color: "var(--accent)",
    },
];

export default function HowItWorks() {
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
        <section className="py-24 relative bg-[var(--bg-secondary)]/50" ref={ref}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--secondary)]/10 text-[var(--secondary-light)] mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        <span className="gradient-text">3단계</span>로 시작하세요
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        복잡한 설정 없이, 5분 만에 AI 학습이 시작됩니다
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] opacity-30" />

                    {steps.map((step, i) => (
                        <div
                            key={step.step}
                            className={`flex flex-col items-center text-center gap-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                }`}
                            style={{ transitionDelay: `${i * 200}ms` }}
                        >
                            {/* Step Circle */}
                            <div className="relative">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                                        boxShadow: `0 8px 32px ${step.color}33`,
                                    }}
                                >
                                    {step.icon}
                                </div>
                                <div
                                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: step.color }}
                                >
                                    {step.step}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{step.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">{step.description}</p>
                            <span className="text-xs text-[var(--text-muted)] glass px-3 py-1 rounded-full">
                                {step.detail}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
