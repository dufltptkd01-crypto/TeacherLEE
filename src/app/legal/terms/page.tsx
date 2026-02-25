export default function TermsPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">이용약관</h2>
      <p className="text-xs text-[var(--text-muted)]">최종 업데이트: 2026-02-25</p>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">1. 서비스 소개</h3>
        <p>Teacher.Lee는 AI 기반 언어/코딩 학습 서비스를 제공합니다. 사용자는 웹 또는 모바일 브라우저를 통해 학습 기능을 이용할 수 있습니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">2. 계정 및 이용자 책임</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>회원은 정확한 정보로 가입해야 하며 계정 보안을 스스로 관리합니다.</li>
          <li>불법적이거나 타인에게 피해를 주는 사용은 금지됩니다.</li>
          <li>서비스 안정성 저해(비정상 트래픽, 자동화 남용 등) 행위는 제한될 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">3. 유료 서비스</h3>
        <p>유료 플랜은 구독 또는 패키지 형태로 제공될 수 있으며, 결제/환불 기준은 환불 정책 문서를 따릅니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">4. 지식재산권</h3>
        <p>서비스 내 UI, 콘텐츠, 상표 등은 Teacher.Lee 또는 정당한 권리자에게 권리가 있습니다. 사전 동의 없는 복제/배포는 제한됩니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">5. 면책 및 책임 제한</h3>
        <p>서비스는 학습 보조 도구이며 특정 시험 합격이나 취업 결과를 보장하지 않습니다. 법령상 허용 범위 내에서 간접/부수 손해 책임은 제한됩니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">6. 문의</h3>
        <p>정책 관련 문의: <a className="text-[var(--primary-light)] hover:underline" href="mailto:dufltptkd01@gmail.com">dufltptkd01@gmail.com</a></p>
      </section>
    </article>
  );
}
