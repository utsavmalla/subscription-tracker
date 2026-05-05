import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
  isAnonymous: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    return null;
  }

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
    isAnonymous: claims.is_anonymous === true,
  };
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireCurrentApiUser(): Promise<CurrentUser | Response> {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  return user;
}
