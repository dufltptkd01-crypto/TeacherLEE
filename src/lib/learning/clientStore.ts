import { createClient } from "@/lib/supabase/client";

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

export type LearningState = {
  plan: OnboardingPlan | null;
  events: StudyEvent[];
  updatedAt: string;
};

const PLAN_KEY = "teacherlee:onboarding";
const EVENTS_KEY = "teacherlee:study-events";
const MAX_EVENTS = 400;

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function eventKey(e: StudyEvent) {
  return `${e.kind}:${e.subject}:${e.at}:${JSON.stringify(e.meta ?? {})}`;
}

function mergeEvents(a: StudyEvent[], b: StudyEvent[]) {
  const map = new Map<string, StudyEvent>();
  [...a, ...b].forEach((e) => map.set(eventKey(e), e));
  return [...map.values()]
    .sort((x, y) => new Date(x.at).getTime() - new Date(y.at).getTime())
    .slice(-MAX_EVENTS);
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

export function setStudyEvents(events: StudyEvent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
}

export function addStudyEvent(event: StudyEvent) {
  if (typeof window === "undefined") return;
  const prev = getStudyEvents();
  setStudyEvents([...prev, event]);
}

export function getLearningState(): LearningState {
  return {
    plan: getOnboardingPlan(),
    events: getStudyEvents(),
    updatedAt: new Date().toISOString(),
  };
}

export function setLearningState(state: LearningState) {
  if (typeof window === "undefined") return;
  if (state.plan) setOnboardingPlan(state.plan);
  setStudyEvents(state.events ?? []);
}

export async function syncLearningToCloud() {
  if (typeof window === "undefined") return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const currentMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const local = getLearningState();

  const nextMeta = {
    ...currentMeta,
    learning_state: local,
  };

  await supabase.auth.updateUser({ data: nextMeta });
}

export async function hydrateLearningFromCloud() {
  if (typeof window === "undefined") return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const cloud = ((user.user_metadata ?? {}) as { learning_state?: LearningState }).learning_state;
  if (!cloud) return;

  const localPlan = getOnboardingPlan();
  const localEvents = getStudyEvents();

  const mergedPlan = localPlan ?? cloud.plan ?? null;
  const mergedEvents = mergeEvents(localEvents, cloud.events ?? []);

  setLearningState({
    plan: mergedPlan,
    events: mergedEvents,
    updatedAt: new Date().toISOString(),
  });

  await syncLearningToCloud();
}
