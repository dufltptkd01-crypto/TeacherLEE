"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const plans = [
    {
        name: "Free",
        price: { monthly: "0", yearly: "0" },
        description: "시작하기에 완벽한 플랜",
        badge: null,
        gradient: "from-[var(--text-muted)] to-[var(--border-light)]",
        features: [
            { text: "AI 텍스트 대화 10회/일", included: true },
            { text: "AI 음성 대화 3회/일", included: true },
            { text: "코드 리뷰 3회/일", included: true },
            { text: "학습 언어 1개", included: true },
            { text: "HTML 기초 과목", included: true },
            { text: "주간 학습 리포트", included: true },
            { text: "시험 대비 모듈", included: false },
            { text: "오프라인 자료 다운로드", included: false },
        ],
    },
    {
        name: "Premium",
        price: { monthly: "14.99", yearly: "9.99" },
        description: "진짜 실력을 키우고 싶다면",
        badge: "MOST POPULAR",
        gradient: "from-[var(--primary)] to-[var(--primary-light)]",
        features: [
            { text: "AI 텍스트 대화 무제한", included: true },
            { text: "AI 음성 대화 30회/일", included: true },
            { text: "코드 리뷰 20회/일", included: true },
            { text: "4개 언어 모두 학습", included: true },
            { text: "HTML + JS 전체 과목", included: true },
            { text: "일간 상세 리포트 + 분석", included: true },
            { text: "TOPIK I, JLPT N4~N5", included: true },
            { text: "PDF 단어장 다운로드", included: true },
        ],
    },
    {
        name: "Pro",
        price: { monthly: "29.99", yearly: "19.99" },
        description: "최고의 학습 경험을 원한다면",
        badge: "BEST VALUE",
        gradient: "from-[var(--accent)] to-[var(--accent-light)]",
        features: [
            { text: "AI 대화 완전 무제한", included: true },
            { text: "AI 음성 대화 무제한", included: true },
            { text: "코드 리뷰 무제한", included: true },
            { text: "4개 언어 + 추가 과목", included: true },
            { text: "전체 프로그래밍 과목", included: true },
            { text: "AI 개인화 커리큘럼", included: true },
            { text: "모든 시험 대비 모듈", included: true },
            { text: "오프라인 학습 팩", included: true },
        ],
    },
];

export default function Pricing() {
    const [yearly, setYearly] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="pricing" className="py-24 relative bg-[var(--bg-secondary)]/50" ref={ref}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--primary)]/10 text-[var(--primary-light)] mb-4">
                        Pricing
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        당신에게 맞는 <span className="gradient-text">요금제</span>를 선택하세요
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                        무료로 시작하고, 필요할 때 업그레이드하세요
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-3 glass rounded-full px-2 py-1.5">
                        <button
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)]"
                                }`}
                            onClick={() => setYearly(false)}
                        >
                            월간
                        </button>
                        <button
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${yearly ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)]"
                                }`}
                            onClick={() => setYearly(true)}
                        >
                            연간 <span className="text-[var(--secondary)] text-xs font-bold">-33%</span>
                        </button>
                    </div>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={plan.name}
                            className={`relative glass rounded-2xl p-8 card-hover transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                } ${plan.badge === "MOST POPULAR" ? "ring-2 ring-[var(--primary)] scale-105" : ""}`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.gradient}`}>
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center mb-6">
                                <h3 className={`text-lg font-bold mb-1 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                                    {plan.name}
                                </h3>
                                <p className="text-xs text-[var(--text-muted)] mb-4">{plan.description}</p>
                                <div className="flex items-end justify-center gap-1">
                                    <span className="text-4xl font-bold text-[var(--text-primary)]">
                                        ${yearly ? plan.price.yearly : plan.price.monthly}
                                    </span>
                                    {plan.price.monthly !== "0" && (
                                        <span className="text-sm text-[var(--text-muted)] mb-1">/월</span>
                                    )}
                                </div>
                                {yearly && plan.price.monthly !== "0" && (
                                    <p className="text-xs text-[var(--text-muted)] mt-1 line-through">
                                        ${plan.price.monthly}/월
                                    </p>
                                )}
                            </div>

                            {/* Divider */}
                            <div className={`h-px bg-gradient-to-r ${plan.gradient} opacity-20 mb-6`} />

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.included ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)] opacity-50"}`}>
                                        <span className={`mt-0.5 text-xs ${f.included ? "text-[var(--secondary)]" : "text-[var(--text-muted)]"}`}>
                                            {f.included ? "✓" : "✗"}
                                        </span>
                                        {f.text}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link
                                href="/login"
                                className={`w-full py-3 rounded-full font-semibold text-sm transition-all inline-flex ${plan.badge === "MOST POPULAR"
                                        ? "btn-primary justify-center"
                                        : "btn-secondary justify-center"
                                    }`}
                            >
                                {plan.price.monthly === "0" ? "무료로 시작" : "시작하기"}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Guarantee */}
                <p className="text-center text-sm text-[var(--text-muted)] mt-8">
                    🔒 7일 무료 체험 · 언제든 해지 · 환불 보장
                </p>
            </div>
        </section>
    );
}
