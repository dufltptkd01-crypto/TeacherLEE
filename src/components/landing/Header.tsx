"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-strong shadow-lg" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                        T.L
                    </div>
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                        Teacher<span className="text-[var(--primary)]">.Lee</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { label: "과목", href: "#features" },
                        { label: "요금제", href: "#pricing" },
                        { label: "FAQ", href: "#faq" },
                    ].map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors px-4 py-2">
                        로그인
                    </Link>
                    <Link href="/login" className="btn-primary text-sm !py-2.5 !px-5">
                        무료 시작 →
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[var(--text-primary)] p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileOpen ? (
                            <path d="M6 6l12 12M6 18L18 6" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden glass-strong border-t border-[var(--border)] animate-slide-up">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {[
                            { label: "과목", href: "#features" },
                            { label: "요금제", href: "#pricing" },
                            { label: "FAQ", href: "#faq" },
                        ].map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <Link href="/login" className="btn-secondary text-sm flex-1 justify-center" onClick={() => setMobileOpen(false)}>로그인</Link>
                            <Link href="/login" className="btn-primary text-sm flex-1 justify-center" onClick={() => setMobileOpen(false)}>무료 시작</Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
