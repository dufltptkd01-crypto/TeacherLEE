"use client";

import { useState, useEffect, useRef } from "react";

const testimonials = [
    {
        name: "Maria S.",
        country: "🇧🇷 Brazil",
        avatar: "M",
        role: "TOPIK II 합격",
        text: "Teacher.Lee의 AI와 매일 한국어로 대화하면서 TOPIK II에 합격했어요! 발음 교정 기능이 특히 좋았습니다. 실제 한국인과 대화하는 것 같았어요.",
        rating: 5,
        color: "var(--primary)",
    },
    {
        name: "Yuki T.",
        country: "🇯🇵 Japan",
        avatar: "Y",
        role: "웹 개발자 전직 성공",
        text: "일본어와 JavaScript를 동시에 배울 수 있다는 게 믿기지 않았어요. AI 코드 리뷰 덕분에 3개월 만에 프론트엔드 개발자로 취업했습니다!",
        rating: 5,
        color: "var(--secondary)",
    },
    {
        name: "John D.",
        country: "🇺🇸 USA",
        avatar: "J",
        role: "한국어 B2 달성",
        text: "듀올링고로 1년 걸린 것을 Teacher.Lee에서 4개월 만에 달성했어요. AI가 제 취약점을 정확히 짚어주고, 맞춤형 연습을 제공해줍니다.",
        rating: 5,
        color: "var(--accent)",
    },
    {
        name: "Li Wei",
        country: "🇨🇳 China",
        avatar: "L",
        role: "JLPT N2 합격",
        text: "중국어 모국어인 저에게 일본어 학습은 어려웠지만, AI 선생님의 세밀한 피드백 덕분에 N2을 한 번에 합격할 수 있었습니다!",
        rating: 5,
        color: "var(--primary-light)",
    },
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((c) => (c + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 relative" ref={ref}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--secondary)]/10 text-[var(--secondary-light)] mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        학습자들의 <span className="gradient-text">생생한 후기</span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <div
                    className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={t.name}
                            className={`glass rounded-2xl p-6 card-hover transition-all duration-500 ${current === i ? "ring-1 ring-[var(--primary)]/50 scale-[1.02]" : ""
                                }`}
                            onClick={() => setCurrent(i)}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            {/* Stars */}
                            <div className="flex gap-0.5 mb-3">
                                {Array.from({ length: t.rating }).map((_, s) => (
                                    <span key={s} className="text-[var(--accent)] text-sm">★</span>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-4">
                                &ldquo;{t.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    style={{ background: t.color }}
                                >
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        {t.country} · {t.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${current === i ? "bg-[var(--primary)] w-6" : "bg-[var(--border)]"
                                }`}
                            onClick={() => setCurrent(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
