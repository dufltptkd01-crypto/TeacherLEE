"use client";

import { useState } from "react";

const faqs = [
    {
        q: "Teacher.Lee는 기존 어학 앱과 뭐가 다른가요?",
        a: "기존 앱은 미리 만들어진 문제를 반복하는 방식이지만, Teacher.Lee는 AI가 당신의 수준과 목표에 맞춰 실시간으로 대화하고 피드백합니다. 발음 교정, 문법 설명, 코드 리뷰까지 한 명의 개인 튜터처럼 동작합니다.",
    },
    {
        q: "무료 플랜으로도 충분히 학습할 수 있나요?",
        a: "네! 무료 플랜에서도 매일 AI 대화 10회, 음성 3회, 코드 리뷰 3회를 이용할 수 있습니다. 기본적인 학습에는 충분하며, 더 많은 연습이 필요하면 Premium으로 업그레이드하시면 됩니다.",
    },
    {
        q: "어떤 언어를 배울 수 있나요?",
        a: "현재 한국어, 영어, 일본어, 중국어 4개 언어와 HTML, JavaScript 프로그래밍을 지원합니다. 향후 베트남어, 스페인어 등도 추가될 예정입니다.",
    },
    {
        q: "TOPIK, JLPT, HSK 시험 대비도 가능한가요?",
        a: "네, Premium 이상 플랜에서 시험 대비 모듈을 제공합니다. AI가 모의시험을 출제하고, 틀린 문제에 대해 상세한 해설과 추가 연습 문제를 제공합니다. Pro 플랜에서는 모든 레벨을 지원합니다.",
    },
    {
        q: "프로그래밍 경험이 전혀 없어도 되나요?",
        a: "물론이죠! HTML과 JavaScript 과목은 완전 초보자를 위한 기초부터 시작합니다. AI가 각 줄의 코드를 친절하게 설명하고, 학습 중인 언어로 주석을 달면서 언어와 코딩을 동시에 배울 수 있습니다.",
    },
    {
        q: "결제 후 환불이 가능한가요?",
        a: "7일 무료 체험 기간 제공. 유료 결제 후에도 불만족 시 30일 이내 전액 환불을 보장합니다. 구독은 언제든 해지할 수 있으며, 해지 후에도 결제 기간 끝까지 이용 가능합니다.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 relative bg-[var(--bg-secondary)]/50">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] mb-4">
                        FAQ
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        자주 묻는 <span className="gradient-text">질문</span>
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="glass rounded-xl overflow-hidden transition-all"
                        >
                            <button
                                className="w-full flex items-center justify-between px-6 py-4 text-left"
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            >
                                <span className="text-sm font-medium text-[var(--text-primary)] pr-4">
                                    {faq.q}
                                </span>
                                <span
                                    className={`text-[var(--text-muted)] transition-transform duration-300 shrink-0 ${openIndex === i ? "rotate-45" : ""
                                        }`}
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10 4v12M4 10h12" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="px-6 pb-4">
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
