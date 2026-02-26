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

function getPrimaryModel() {
  return (process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
}

export async function GET() {
  const key = getOpenAIKey();
  if (!key) {
    return NextResponse.json({
      ok: false,
      reason: "missing_openai_api_key",
      keyDetected: false,
      model: getPrimaryModel(),
    });
  }

  try {
    const client = new OpenAI({ apiKey: key });
    const model = getPrimaryModel();

    try {
      await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
        temperature: 0,
      }, { timeout: 15000 });

      return NextResponse.json({ ok: true, keyDetected: true, model });
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const code = (err as { code?: string })?.code;

      if (status === 404 || code === "model_not_found") {
        await client.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 5,
          temperature: 0,
        }, { timeout: 15000 });

        return NextResponse.json({
          ok: true,
          keyDetected: true,
          model,
          fallbackModel: "gpt-4.1-mini",
          warning: "primary_model_unavailable",
        });
      }

      return NextResponse.json({
        ok: false,
        keyDetected: true,
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
