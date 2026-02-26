import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PRIVILEGED_EMAILS = ["dufltptkd01@naver.com"];

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/onboarding";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.email && PRIVILEGED_EMAILS.includes(user.email.toLowerCase())) {
                await supabase.auth.updateUser({
                    data: {
                        role: "admin",
                        plan: "enterprise",
                        premium: true,
                        access_scope: "all",
                    },
                });
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
