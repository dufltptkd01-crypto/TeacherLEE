import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function pickKey() {
  return (
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_KEY ||
    process.env.OPENAI_TOKEN ||
    ""
  )
    .trim()
    .replace(/^['\"]|['\"]$/g, "");
}

function usingOpenRouter() {
  return !!process.env.OPENROUTER_API_KEY;
}

function client() {
  const key = pickKey();
  if (usingOpenRouter()) {
    return new OpenAI({
      apiKey: key,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://teacher-lee.dufltptkd01.workers.dev",
        "X-Title": "TeacherLEE",
      },
    });
  }
  return new OpenAI({ apiKey: key });
}

function model() {
  if (usingOpenRouter()) return process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export async function POST(req: NextRequest) {
  const { pattern, text, subject } = await req.json();
  if (!pattern || !text) {
    return NextResponse.json({ error: "pattern and text are required" }, { status: 400 });
  }

  const key = pickKey();
  if (!key) {
    const score = Math.max(40, Math.min(85, text.length));
    return NextResponse.json({
      score,
      feedback: "AI 채점 키가 없어 길이 기반 임시 점수로 표시됩니다. 핵심 어순/문법을 한 번 더 점검해 보세요.",
      fallback: true,
    });
  }

  try {
    const prompt = `You are a strict but helpful language-writing evaluator.\nSubject: ${subject || "korean"}\nPattern target: ${pattern}\nUser text: ${text}\n\nReturn JSON only with keys: score(0-100 integer), feedback(short Korean advice).`;

    const res = await client().chat.completions.create(
      {
        model: model(),
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 200,
        stream: false,
      },
      { timeout: 20000 }
    );

    const raw = ("choices" in res ? res.choices[0]?.message?.content : "") || "";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return NextResponse.json({
      score: Number(parsed.score) || 60,
      feedback: String(parsed.feedback || "좋아요. 문장 연결을 조금 더 자연스럽게 다듬어 보세요."),
    });
  } catch {
    const score = Math.max(45, Math.min(90, Math.round(text.length * 0.9)));
    return NextResponse.json({
      score,
      feedback: "임시 채점 결과입니다. 핵심 패턴을 문장 앞부분에 명확히 넣어 다시 작성해 보세요.",
      fallback: true,
    });
  }
}
