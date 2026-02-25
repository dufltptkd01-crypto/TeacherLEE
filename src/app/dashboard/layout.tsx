"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { icon: "📊", label: "대시보드", href: "/dashboard" },
    { icon: "🗣️", label: "AI 대화", href: "/dashboard/chat" },
    { icon: "💻", label: "코딩 학습", href: "/dashboard/code" },
    { icon: "📝", label: "시험 대비", href: "/dashboard/exam" },
    { icon: "📈", label: "리포트", href: "/dashboard/report" },
    { icon: "⚙️", label: "설정", href: "/dashboard/settings" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)]">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)]/50 shrink-0">
                {/* Logo */}
                <div className="px-6 h-16 flex items-center border-b border-[var(--border)]">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xs">
                            T.L
                        </div>
                        <span className="text-base font-bold text-[var(--text-primary)]">
                            Teacher<span className="text-[var(--primary-light)]">.Lee</span>
                        </span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === item.href
                                    ? "bg-[var(--primary)]/15 text-[var(--primary-light)]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Upgrade Banner */}
                <div className="p-4">
                    <div className="rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 border border-[var(--primary)]/20 p-4">
                        <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                            💎 Premium으로 업그레이드
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mb-3">
                            무제한 AI 대화, 시험 대비 등
                        </p>
                        <button className="w-full btn-primary text-xs !py-2 justify-center">
                            업그레이드
                        </button>
                    </div>
                </div>

                {/* User */}
                <div className="px-4 py-3 border-t border-[var(--border)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] flex items-center justify-center text-white text-xs font-bold">
                        U
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                            User
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">Free Plan</div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass-strong border-b border-[var(--border)] flex items-center px-3 pt-[max(0px,env(safe-area-inset-top))]">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-[var(--text-primary)] h-11 w-11 flex items-center justify-center rounded-xl"
                >
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <Link href="/" className="flex items-center gap-2 ml-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-[10px]">
                        T.L
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                        Teacher<span className="text-[var(--primary-light)]">.Lee</span>
                    </span>
                </Link>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 bg-[var(--bg-secondary)] border-r border-[var(--border)] animate-slide-up flex flex-col">
                        <div className="px-6 h-14 flex items-center justify-between border-b border-[var(--border)]">
                            <span className="text-sm font-bold text-[var(--text-primary)]">메뉴</span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-[var(--text-muted)]"
                            >
                                ✕
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === item.href
                                            ? "bg-[var(--primary)]/15 text-[var(--primary-light)]"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span>{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 lg:ml-0 mt-14 lg:mt-0 pb-[84px] lg:pb-0">{children}</main>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-[var(--border)] px-2 pt-2 pb-[max(10px,env(safe-area-inset-bottom))]">
                <div className="grid grid-cols-4 gap-1">
                    {navItems.slice(0, 4).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 min-h-11 py-1.5 px-1 rounded-lg text-center ${pathname === item.href
                                    ? "text-[var(--primary-light)] bg-[var(--primary)]/10"
                                    : "text-[var(--text-muted)]"
                                }`}
                        >
                            <span className="text-lg leading-none">{item.icon}</span>
                            <span className="text-[10px] font-medium leading-none tracking-[-0.01em]">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
