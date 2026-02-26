"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const PRIVILEGED_EMAILS = ["dufltptkd01@naver.com"];

async function applyPrivilegedAccess(email?: string | null) {
    if (!email) return;
    if (!PRIVILEGED_EMAILS.includes(email.toLowerCase())) return;

    const supabase = await createClient();
    await supabase.auth.updateUser({
        data: {
            role: "admin",
            plan: "enterprise",
            premium: true,
            access_scope: "all",
        },
    });
}

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { data: loginData, error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    await applyPrivilegedAccess(loginData.user?.email);

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                full_name: formData.get("name") as string,
            },
        },
    };

    const { data: signUpData, error } = await supabase.auth.signUp(data);

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    if (signUpData.session) {
        await applyPrivilegedAccess(signUpData.user?.email);
        revalidatePath("/", "layout");
        redirect("/onboarding");
    }

    revalidatePath("/", "layout");
    redirect("/login?verify=1");
}

function getOAuthRedirectTo() {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

    return `${baseUrl.replace(/\/$/, "")}/auth/callback`;
}

async function signInWithOAuthProvider(provider: "google" | "apple") {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: getOAuthRedirectTo(),
        },
    });

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signInWithGoogle() {
    await signInWithOAuthProvider("google");
}

export async function signInWithApple() {
    await signInWithOAuthProvider("apple");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}
