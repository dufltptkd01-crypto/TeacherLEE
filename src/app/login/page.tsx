"use client";

import { useState } from "react";
import Link from "next/link";
import { login, signup, signInWithGoogle } from "./actions";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const searchParams =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;

    const error = searchParams?.get("error") ?? null;
    const verify = searchParams?.get("verify") === "1";

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

                    {verify && (
                        <div className="rounded-xl border border-emerald-300/50 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                            회원가입 완료! 이메일로 보낸 인증 링크를 눌러 계정을 활성화한 뒤 로그인해 주세요.
                        </div>
                    )}

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
                                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.23 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.84 1.154 7.958 3.042l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.84 1.154 7.958 3.042l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.144 35.091 26.715 36 24 36c-5.21 0-9.621-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.043 12.043 0 0 1-4.084 5.57l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                                </svg>
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
