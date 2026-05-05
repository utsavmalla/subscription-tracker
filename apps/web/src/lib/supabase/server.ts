import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseUrl, requireSupabasePublishableKey } from "./env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl(),
    requireSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies; proxy.ts refreshes sessions.
          }
        },
      },
    },
  );
}
