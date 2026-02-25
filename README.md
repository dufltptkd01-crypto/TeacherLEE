# TeacherLEE

AI 튜터 기반 다국어/코딩 학습 플랫폼 (Next.js).

## 핵심 목표
- 언어 학습: 한국어/영어/일본어/중국어
- 코딩 학습: HTML/CSS/JavaScript
- 개인화 학습: AI 대화, 코드 리뷰, 시험 대비
- 수익화: Freemium + Premium + 단기 패키지

## 새로 추가된 기획 문서
- `PROMPT_CODEX53.md`  
  Codex 5.3에게 바로 넣어 실행 가능한 실무형 프롬프트
- `CURRICULUM_V2.md`  
  Language + Coding 통합 커리큘럼 v2 (레벨/주차/평가 기준 포함)

## 개발 실행
```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 다음 권장 작업
1. `CURRICULUM_V2.md` 기반으로 `src/lib/curriculum.ts` 데이터 모델링
2. `/dashboard` 미션/코스 데이터를 트랙 기반으로 치환
3. `/onboarding` 목표→추천 트랙 로직 추가
4. `/api/chat` 프롬프트 최적화(요약 메모리 + 토큰 절감)
