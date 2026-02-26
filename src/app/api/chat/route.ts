import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

function getOpenAI() {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are Teacher Lee (이선생), a friendly, patient, and highly skilled AI language tutor.

CORE TRAITS:
- Warm and encouraging personality, using Korean honorifics (존댓말)
- Expert in Korean, English, Japanese, and Chinese
- Also knowledgeable about web development (HTML, CSS, JavaScript)
- Adapts difficulty based on the learner's level

INTERACTION RULES:
1. Always greet warmly and use the student's progress to personalize responses
2. When teaching language: explain grammar, give examples, and create practice exercises
3. When teaching coding: explain concepts in simple terms with code examples, and include relevant vocabulary in the learner's target language
4. Provide real-time corrections with encouraging feedback
5. Use emojis sparingly for friendliness (1-2 per message)
6. Keep responses concise but comprehensive
7. End responses with a practice question or follow-up prompt when appropriate

LANGUAGE RULES:
- Default communication language: Korean
- Switch to the learner's native language if they struggle
- Always provide pronunciation hints for new vocabulary
- Use markdown formatting for code blocks and organized content`;

async function createWithRetry(params: Parameters<OpenAI["chat"]["completions"]["create"]>[0]) {
    const retries = 2;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await getOpenAI().chat.completions.create(params, {
                timeout: 20000,
            });
        } catch (error: unknown) {
            const status = (error as { status?: number })?.status;
            const isRetriable = status === 429 || (status !== undefined && status >= 500);
            const isLast = attempt === retries;

            if (!isRetriable || isLast) throw error;

            const delayMs = 400 * (attempt + 1);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }

    throw new Error("OpenAI retry failed");
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const subject = body?.subject;

        const incomingMessages = Array.isArray(body?.messages)
            ? body.messages
            : Array.isArray(body?.history)
                ? body.history
                : [];

        const normalizedMessages = incomingMessages
            .map((m: { role?: string; content?: string; text?: string }) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content || m.text || "",
            }))
            .filter((m: { content: string }) => m.content.trim().length > 0)
            .slice(-10);

        if (body?.message && typeof body.message === "string") {
            normalizedMessages.push({ role: "user", content: body.message.trim() });
        }

        if (!normalizedMessages.length) {
            return NextResponse.json(
                { error: "messages/history/message is required" },
                { status: 400 }
            );
        }

        const subjectContext =
            subject === "korean"
                ? "The student is learning Korean."
                : subject === "english"
                    ? "The student is learning English."
                    : subject === "japanese"
                        ? "The student is learning Japanese."
                        : subject === "chinese"
                            ? "The student is learning Chinese."
                            : "The student is learning programming.";

        const completion = await createWithRetry({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `${SYSTEM_PROMPT}\n\nCONTEXT: ${subjectContext}`,
                },
                ...normalizedMessages,
            ],
            max_tokens: 1024,
            temperature: 0.7,
            stream: false,
        });

        const reply = "choices" in completion ? completion.choices[0]?.message?.content || "" : "";
        const usage = "usage" in completion ? completion.usage : undefined;

        return NextResponse.json({
            message: reply,
            usage: {
                prompt_tokens: usage?.prompt_tokens,
                completion_tokens: usage?.completion_tokens,
            },
        });
    } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        console.error("Chat API Error:", error);

        if (status === 429) {
            return NextResponse.json(
                { error: "AI 요청이 많아 잠시 지연되고 있어요. 잠시 후 다시 시도해주세요." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
