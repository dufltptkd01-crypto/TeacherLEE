"use client";

import { useState } from "react";
import Link from "next/link";
import { login, signup, signInWithGoogle } from "./actions";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const error =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("error")
            : null;

    return (
        <div className="min-h-screen flex items-center justify-center relative hero-grid px-6">
            {/* Background */}
            <div className="hero-glow -top-40 -left-20" />
            <div
                className="hero-glow -bottom-40 -right-20 opacity-50"
                style={{
                    background:
                        "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
                }}
            />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        T.L
                    </div>
                    <span className="text-xl font-bold text-[var(--text-primary)]">
                        Teacher<span className="text-[var(--primary-light)]">.Lee</span>
                    </span>
                </Link>

                {/* Card */}
                <div className="glass rounded-2xl p-8 space-y-6">
                    {/* Tab Toggle */}
                    <div className="flex rounded-full bg-[var(--bg-primary)] p-1">
                        <button
                            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${isLogin
                                    ? "bg-[var(--primary)] text-white"
                                    : "text-[var(--text-muted)]"
                                }`}
                            onClick={() => setIsLogin(true)}
                        >
                            로그인
                        </button>
                        <button
                            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${!isLogin
                                    ? "bg-[var(--primary)] text-white"
                                    : "text-[var(--text-muted)]"
                                }`}
                            onClick={() => setIsLogin(false)}
                        >
                            회원가입
                        </button>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-300/50 bg-red-50 px-3 py-2 text-xs text-red-700">
                            로그인 오류: {decodeURIComponent(error)}
                        </div>
                    )}

                    {/* Social Login */}
                    <div className="space-y-3">
                        <form action={signInWithGoogle}>
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all bg-white text-gray-700 hover:bg-gray-100"
                            >
                                <span className="text-base">G</span>
                                Google로 계속하기
                            </button>
                        </form>

                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-[var(--border)]" />
                        <span className="text-xs text-[var(--text-muted)]">또는</span>
                        <div className="flex-1 h-px bg-[var(--border)]" />
                    </div>

                    {/* Form */}
                    <form action={isLogin ? login : signup} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                                    이름
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="홍길동"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition-colors"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                                이메일
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                                비밀번호
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition-colors"
                            />
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-xs text-[var(--primary-light)] hover:underline"
                                >
                                    비밀번호를 잊으셨나요?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full btn-primary justify-center !py-3 mt-2"
                        >
                            {isLogin ? "로그인" : "회원가입"}
                        </button>
                    </form>

                    {/* Terms */}
                    {!isLogin && (
                        <p className="text-xs text-center text-[var(--text-muted)]">
                            가입 시{" "}
                            <a href="#" className="text-[var(--primary-light)] hover:underline">
                                이용약관
                            </a>{" "}
                            및{" "}
                            <a href="#" className="text-[var(--primary-light)] hover:underline">
                                개인정보처리방침
                            </a>
                            에 동의합니다
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
