"use client";

import { useEffect, useState, useRef } from "react";

const stats = [
    { value: 5000, suffix: "+", label: "학습자가 이미 시작했어요", icon: "👥" },
    { value: 42, suffix: "개국", label: "전 세계에서 학습 중", icon: "🌍" },
    { value: 4.9, suffix: "/5", label: "평균 만족도", icon: "⭐" },
    { value: 50000, suffix: "+", label: "AI 대화 완료", icon: "💬" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Number.isInteger(value) ? Math.floor(current) : parseFloat(current.toFixed(1)));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [visible, value]);

    return (
        <div ref={ref} className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
            {display.toLocaleString()}<span className="text-[var(--primary-light)]">{suffix}</span>
        </div>
    );
}

export default function SocialProof() {
    return (
        <section className="relative py-16 border-y border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                            <span className="text-2xl mb-1">{stat.icon}</span>
                            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
