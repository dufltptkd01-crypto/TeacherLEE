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

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { messages, subject } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Messages array is required" },
                { status: 400 }
            );
        }

        // Add subject context
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

        const completion = await getOpenAI().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `${SYSTEM_PROMPT}\n\nCONTEXT: ${subjectContext}`,
                },
                ...messages,
            ],
            max_tokens: 1024,
            temperature: 0.7,
        });

        const reply = completion.choices[0]?.message?.content || "";

        return NextResponse.json({
            message: reply,
            usage: {
                prompt_tokens: completion.usage?.prompt_tokens,
                completion_tokens: completion.usage?.completion_tokens,
            },
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
