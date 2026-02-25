import Link from "next/link";

const navItems = [
  { href: "/legal/terms", label: "이용약관" },
  { href: "/legal/privacy", label: "개인정보처리방침" },
  { href: "/legal/cookies", label: "쿠키 정책" },
  { href: "/legal/refund", label: "환불 정책" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen hero-grid py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          ← 홈으로
        </Link>

        <div className="glass rounded-2xl mt-4 p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Legal</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">Teacher.Lee 서비스 이용 관련 정책 문서입니다.</p>

          <nav className="mt-5 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs sm:text-sm px-3 py-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40 hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-7 text-sm leading-7 text-[var(--text-secondary)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
