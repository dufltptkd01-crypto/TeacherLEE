"use client";

import { useEffect, useMemo, useState } from "react";
import { getPatternScores, getStudyEvents, getVocabCards, hydrateLearningFromCloud } from "@/lib/learning/clientStore";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function ReportPage() {
  const [events, setEvents] = useState(() => getStudyEvents());
  const [vocabCards, setVocabCards] = useState(() => getVocabCards());
  const [patternScores, setPatternScores] = useState(() => getPatternScores());

  useEffect(() => {
    hydrateLearningFromCloud()
      .catch(() => undefined)
      .finally(() => {
        setEvents(getStudyEvents());
        setVocabCards(getVocabCards());
        setPatternScores(getPatternScores());
      });
  }, []);

  const [now] = useState(() => Date.now());
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const weekEvents = events.filter((e) => new Date(e.at).getTime() >= weekAgo);
  const weekChat = weekEvents.filter((e) => e.kind === "chat").length;
  const weekCode = weekEvents.filter((e) => e.kind === "code").length;

  const weekNewWords = vocabCards.filter((v) => new Date(v.addedAt).getTime() >= weekAgo);
  const weekPattern = patternScores.filter((p) => new Date(p.at).getTime() >= weekAgo);

  const avgPatternScore = weekPattern.length
    ? Math.round(weekPattern.reduce((a, b) => a + b.score, 0) / weekPattern.length)
    : 0;

  const weekData = useMemo(() => {
    const arr = Array.from({ length: 7 }).map((_, i) => {
      const d = startOfDay(new Date(now - (6 - i) * 24 * 60 * 60 * 1000));
      const next = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      const dayEvents = events.filter((e) => {
        const t = new Date(e.at).getTime();
        return t >= d.getTime() && t < next.getTime();
      });
      return {
        day: dayLabels[d.getDay()],
        minutes: dayEvents.length * 8,
        conversations: dayEvents.filter((e) => e.kind === "chat").length,
      };
    });
    return arr;
  }, [events, now]);

  const maxMinutes = Math.max(1, ...weekData.map((d) => d.minutes));

  const patternTrend = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = startOfDay(new Date(now - (6 - i) * 24 * 60 * 60 * 1000));
      const next = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      const dayScores = patternScores.filter((p) => {
        const t = new Date(p.at).getTime();
        return t >= d.getTime() && t < next.getTime();
      });
      const avg = dayScores.length
        ? Math.round(dayScores.reduce((a, b) => a + b.score, 0) / dayScores.length)
        : 0;
      return { day: dayLabels[d.getDay()], score: avg };
    });
  }, [patternScores, now]);

  const maxPatternScore = Math.max(1, ...patternTrend.map((d) => d.score));

  const subjectGoals = [
    {
      subject: "한국어",
      icon: "🇰🇷",
      vocabTarget: 100,
      patternTarget: 40,
      vocabDone: weekNewWords.filter((w) => w.subject === "korean").length,
      patternDone: weekPattern.length,
    },
    {
      subject: "영어",
      icon: "🇺🇸",
      vocabTarget: 100,
      patternTarget: 40,
      vocabDone: weekNewWords.filter((w) => w.subject === "english").length,
      patternDone: weekPattern.length,
    },
    {
      subject: "일본어",
      icon: "🇯🇵",
      vocabTarget: 100,
      patternTarget: 40,
      vocabDone: weekNewWords.filter((w) => w.subject === "japanese").length,
      patternDone: weekPattern.length,
    },
    {
      subject: "중국어",
      icon: "🇨🇳",
      vocabTarget: 100,
      patternTarget: 40,
      vocabDone: weekNewWords.filter((w) => w.subject === "chinese").length,
      patternDone: weekPattern.length,
    },
  ];

  const recentPattern = patternScores.slice(0, 5);

  const lowProgressSubjects = subjectGoals.filter((g) => {
    const vocabPct = (g.vocabDone / g.vocabTarget) * 100;
    const patternPct = (g.patternDone / g.patternTarget) * 100;
    return vocabPct < 70 || patternPct < 70;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 pb-6 lg:pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">📈 학습 리포트</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">이번 주 학습 통계와 AI 분석 결과</p>
      </div>

      {lowProgressSubjects.length > 0 && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-amber-200 mb-1">🔔 주간 목표 알림</p>
          <p className="text-xs text-amber-100">
            {lowProgressSubjects.map((s) => `${s.icon} ${s.subject}`).join(", ")} 과목의 목표 달성률이 70% 미만입니다. 오늘 단어 복습 + 패턴 3개를 우선 진행해보세요.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "총 학습 시간", value: `${(weekEvents.length * 8 / 60).toFixed(1)}h`, icon: "⏱" },
          { label: "AI 대화 수", value: `${weekChat}회`, icon: "🗣️" },
          { label: "신규 단어", value: `${weekNewWords.length}개`, icon: "🧠" },
          { label: "패턴 평균", value: weekPattern.length ? `${avgPatternScore}점` : "-", icon: "🧩" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-6">📊 일별 학습 시간</h2>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-3 h-40 min-w-[420px]">
            {weekData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-[var(--text-muted)]">{d.minutes}분</span>
                <div className="w-full max-w-10 rounded-t-lg bg-[var(--bg-primary)] relative" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-[var(--primary)] to-[var(--primary-light)]"
                    style={{ height: `${(d.minutes / maxMinutes) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)]">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">🎯 과목별 주간 목표 달성률</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {subjectGoals.map((g) => {
            const vocabPct = Math.min(100, Math.round((g.vocabDone / g.vocabTarget) * 100));
            const patternPct = Math.min(100, Math.round((g.patternDone / g.patternTarget) * 100));
            return (
              <div key={g.subject} className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">{g.icon} {g.subject}</p>
                <p className="text-xs text-[var(--text-muted)] mb-1">단어 {g.vocabDone}/{g.vocabTarget}</p>
                <div className="h-1.5 rounded-full bg-[var(--bg-primary)] mb-2"><div className="h-1.5 rounded-full bg-[var(--secondary)]" style={{ width: `${vocabPct}%` }} /></div>
                <p className="text-xs text-[var(--text-muted)] mb-1">패턴 {g.patternDone}/{g.patternTarget}</p>
                <div className="h-1.5 rounded-full bg-[var(--bg-primary)]"><div className="h-1.5 rounded-full bg-[var(--primary)]" style={{ width: `${patternPct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">🧪 패턴 채점 자동 집계</h2>
        {recentPattern.length ? (
          <div className="space-y-2">
            {recentPattern.map((p) => (
              <div key={p.id} className="rounded-xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{p.pattern}</span>
                  <span className="text-xs text-[var(--secondary)]">{p.score}점</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">{p.feedback}</p>
                {p.rubric && (
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    문법 {p.rubric.grammar} · 자연스러움 {p.rubric.fluency} · 어휘 {p.rubric.vocabulary}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">아직 패턴 채점 기록이 없습니다. 채팅의 문장패턴 탭에서 AI 채점을 시작해보세요.</p>
        )}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">📉 패턴 채점 점수 추세 (7일)</h2>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-3 h-36 min-w-[420px]">
            {patternTrend.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-[var(--text-muted)]">{d.score || "-"}</span>
                <div className="w-full max-w-10 rounded-t-lg bg-[var(--bg-primary)] relative" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-[var(--secondary)] to-[var(--primary-light)]"
                    style={{ height: d.score ? `${(d.score / maxPatternScore) * 100}%` : "4%" }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)]">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">🧠 AI 분석 인사이트</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)]"><span>💪</span><p className="text-sm text-[var(--text-secondary)]">이번 주 실제 학습 이벤트 {weekEvents.length}회가 기록되었습니다.</p></div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)]"><span>📌</span><p className="text-sm text-[var(--text-secondary)]">코드 제출 {weekCode}회, 대화 {weekChat}회. 균형이 필요한지 확인해보세요.</p></div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)]"><span>💡</span><p className="text-sm text-[var(--text-secondary)]">단어 목표(100)와 패턴 목표(40)를 기준으로 하루 루틴을 자동 조정하면 효율이 올라갑니다.</p></div>
        </div>
      </div>
    </div>
  );
}
