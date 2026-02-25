export default function RefundPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">환불 정책</h2>
      <p className="text-xs text-[var(--text-muted)]">최종 업데이트: 2026-02-25</p>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">1. 무료 체험</h3>
        <p>일부 유료 플랜은 무료 체험 기간을 제공할 수 있으며, 체험 종료 전 해지 시 요금이 청구되지 않습니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">2. 월 구독 환불</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>결제일로부터 7일 이내이며 사용량이 매우 적은 경우 환불을 검토합니다.</li>
          <li>디지털 서비스 특성상 과도한 사용 후 환불은 제한될 수 있습니다.</li>
          <li>중복 결제/오결제는 확인 후 환불 처리합니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">3. 패키지 상품 환불</h3>
        <p>패키지 상품은 이용 시작 전 100% 환불, 이용 시작 후에는 사용량에 따라 부분 환불 기준이 적용될 수 있습니다.</p>
      </section>

      <section>
        <h3 className="font-semibold text-[var(--text-primary)]">4. 환불 신청 방법</h3>
        <p>
          결제 내역(이메일/주문정보)과 사유를 포함해
          <a className="text-[var(--primary-light)] hover:underline ml-1" href="mailto:dufltptkd01@gmail.com">dufltptkd01@gmail.com</a>
          으로 접수해 주세요.
        </p>
      </section>
    </article>
  );
}
