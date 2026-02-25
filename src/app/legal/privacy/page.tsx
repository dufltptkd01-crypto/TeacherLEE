export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">개인정보처리방침</h2>
      <p className="text-xs text-[var(--text-muted)]">최종 업데이트: 2026-02-25</p>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">1. 수집 항목</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>필수: 이메일, 로그인 식별자, 서비스 이용 로그</li>
          <li>선택: 프로필 정보, 학습 목표/선호도, 피드백 데이터</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">2. 이용 목적</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>회원 식별 및 인증, 고객 문의 응대</li>
          <li>학습 맞춤화(레벨 추천, 피드백 제공)</li>
          <li>서비스 품질 개선 및 보안 대응</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">3. 보관 기간</h3>
        <p>관련 법령 또는 서비스 목적 달성 시점까지 보관하며, 보관 사유가 없어진 정보는 지체 없이 파기합니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">4. 제3자 제공 및 처리위탁</h3>
        <p>서비스 운영을 위해 인증/인프라 제공자(Supabase, Cloudflare 등)를 이용할 수 있으며, 법령에 근거하거나 이용자 동의가 있는 경우를 제외하고 무단 제공하지 않습니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">5. 이용자 권리</h3>
        <p>이용자는 열람/정정/삭제/처리정지를 요청할 수 있습니다. 요청은 아래 이메일로 접수됩니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">6. 문의</h3>
        <p>개인정보 문의: <a className="text-[var(--primary-light)] hover:underline" href="mailto:dufltptkd01@gmail.com">dufltptkd01@gmail.com</a></p>
      </section>
    </article>
  );
}
