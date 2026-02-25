export default function CookiesPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">쿠키 정책</h2>
      <p className="text-xs text-[var(--text-muted)]">최종 업데이트: 2026-02-25</p>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">1. 쿠키란?</h3>
        <p>쿠키는 서비스 이용 시 브라우저에 저장되는 작은 텍스트 파일로, 로그인 유지와 사용성 개선에 활용됩니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">2. 사용 목적</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>인증 세션 유지 및 보안</li>
          <li>기본 UI/언어 설정 저장</li>
          <li>서비스 성능 분석 및 오류 추적</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">3. 쿠키 관리</h3>
        <p>사용자는 브라우저 설정에서 쿠키 허용/차단/삭제를 선택할 수 있습니다. 단, 필수 쿠키 차단 시 일부 기능(로그인 등)이 제한될 수 있습니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">4. 서드파티 도구</h3>
        <p>분석 및 인증 연동을 위해 제3자 서비스에서 쿠키를 사용할 수 있으며, 각 서비스 제공자의 정책을 따릅니다.</p>
      </section>
    </article>
  );
}
