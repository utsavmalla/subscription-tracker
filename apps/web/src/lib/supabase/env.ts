export function getSupabaseUrl() {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

export function requireSupabasePublishableKey() {
  const key = getSupabasePublishableKey();

  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required.",
    );
  }

  return key;
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}
