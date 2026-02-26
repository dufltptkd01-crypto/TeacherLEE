export type OnboardingPlanSubject = {
  id: string;
  type: "language" | "programming";
  title: string;
  icon: string;
  level: string;
};

export type OnboardingPlan = {
  subjects: OnboardingPlanSubject[];
  goals: string[];
  createdAt: string;
};

export type StudyEvent = {
  kind: "chat" | "code" | "exam";
  subject: string;
  at: string;
  meta?: Record<string, string | number | boolean>;
};

const PLAN_KEY = "teacherlee:onboarding";
const EVENTS_KEY = "teacherlee:study-events";

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getOnboardingPlan(): OnboardingPlan | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<OnboardingPlan | null>(localStorage.getItem(PLAN_KEY), null);
}

export function setOnboardingPlan(plan: OnboardingPlan) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

export function getStudyEvents(): StudyEvent[] {
  if (typeof window === "undefined") return [];
  return safeJsonParse<StudyEvent[]>(localStorage.getItem(EVENTS_KEY), []);
}

export function addStudyEvent(event: StudyEvent) {
  if (typeof window === "undefined") return;
  const prev = getStudyEvents();
  prev.push(event);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(prev.slice(-400)));
}
