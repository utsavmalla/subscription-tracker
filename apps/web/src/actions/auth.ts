"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/server/auth/currentUser";

export async function sendMagicLinkAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    redirect("/login?message=Email%20is%20required.");
  }

  const supabase = await createClient();
  const redirectTo = await getAuthCallbackUrl();
  const user = await getCurrentUser();
  const result = user?.isAnonymous
    ? await supabase.auth.updateUser({ email }, { emailRedirectTo: redirectTo })
    : await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      });

  if (result.error) {
    redirect(`/login?message=${encodeURIComponent(result.error.message)}`);
  }

  const message = user?.isAnonymous
    ? "Check your email to upgrade your guest account."
    : "Check your email for the sign-in link.";

  redirect(`/login?message=${encodeURIComponent(message)}`);
}

export async function continueAsGuestAction() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }
  }

  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function getAuthCallbackUrl() {
  const requestHeaders = await headers();
  const origin = normalizeOrigin(
    process.env.NEXT_PUBLIC_SITE_URL ??
      requestHeaders.get("origin") ??
      "http://localhost:3000",
  );

  return `${origin}/auth/callback`;
}

function normalizeOrigin(value: string) {
  return value.trim().replace(/\/+$/, "");
}
