import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

function getOpenAI() {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const CODE_REVIEW_PROMPT = `You are Teacher Lee's code review AI assistant.

REVIEW RULES:
1. Review code line by line
2. For each issue or good practice, provide feedback in this JSON format:
   { "type": "success" | "tip" | "warning" | "error", "line": "Line X", "text": "feedback in Korean" }
3. Include language learning tips: translate programming terms to the student's target language
4. Be encouraging — praise good patterns before pointing out improvements
5. Suggest more concise/modern alternatives when applicable
6. Return a JSON array of feedback items

IMPORTANT: Respond ONLY with a valid JSON array. No markdown, no extra text.`;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code, language } = await request.json();

        if (!code) {
            return NextResponse.json(
                { error: "Code is required" },
                { status: 400 }
            );
        }

        const completion = await getOpenAI().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: CODE_REVIEW_PROMPT },
                {
                    role: "user",
                    content: `Review this ${language || "JavaScript"} code:\n\n${code}`,
                },
            ],
            max_tokens: 1024,
            temperature: 0.3,
        });

        const reply = completion.choices[0]?.message?.content || "[]";

        try {
            const feedback = JSON.parse(reply);
            return NextResponse.json({ feedback });
        } catch {
            return NextResponse.json({
                feedback: [
                    {
                        type: "tip",
                        line: "General",
                        text: reply,
                    },
                ],
            });
        }
    } catch (error) {
        console.error("Code Review API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
