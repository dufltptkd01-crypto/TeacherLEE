import { NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAIKey() {
  const raw =
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_KEY ||
    process.env.OPENAI_TOKEN ||
    "";
  return raw.trim().replace(/^['\"]|['\"]$/g, "");
}

function getOpenRouterKey() {
  const raw = process.env.OPENROUTER_API_KEY || "";
  return raw.trim().replace(/^['\"]|['\"]$/g, "");
}

function usingOpenRouter() {
  return !!getOpenRouterKey();
}

function getPrimaryModel() {
  if (usingOpenRouter()) return (process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini").trim();
  return (process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
}

export async function GET() {
  const openAIKey = getOpenAIKey();
  const openRouterKey = getOpenRouterKey();

  if (!openAIKey && !openRouterKey) {
    return NextResponse.json({
      ok: false,
      reason: "missing_openai_or_openrouter_key",
      keyDetected: false,
      provider: "none",
      model: getPrimaryModel(),
    });
  }

  try {
    const client = usingOpenRouter()
      ? new OpenAI({
          apiKey: openRouterKey,
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://teacher-lee.dufltptkd01.workers.dev",
            "X-Title": "TeacherLEE",
          },
        })
      : new OpenAI({ apiKey: openAIKey });

    const model = getPrimaryModel();

    try {
      await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
        temperature: 0,
      }, { timeout: 15000 });

      return NextResponse.json({ ok: true, keyDetected: true, provider: usingOpenRouter() ? "openrouter" : "openai", model });
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const code = (err as { code?: string })?.code;

      if (status === 404 || code === "model_not_found") {
        const fallbackModel = usingOpenRouter() ? "openai/gpt-4.1-mini" : "gpt-4.1-mini";
        await client.chat.completions.create({
          model: fallbackModel,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 5,
          temperature: 0,
        }, { timeout: 15000 });

        return NextResponse.json({
          ok: true,
          keyDetected: true,
          provider: usingOpenRouter() ? "openrouter" : "openai",
          model,
          fallbackModel,
          warning: "primary_model_unavailable",
        });
      }

      return NextResponse.json({
        ok: false,
        keyDetected: true,
        provider: usingOpenRouter() ? "openrouter" : "openai",
        model,
        reason: status ? `openai_status_${status}` : "openai_runtime_error",
        code: code ?? null,
      });
    }
  } catch (e: unknown) {
    const message = (e as { message?: string })?.message ?? "unknown_error";
    return NextResponse.json({ ok: false, reason: "health_exception", message });
  }
}
