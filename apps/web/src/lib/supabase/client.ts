"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl, requireSupabasePublishableKey } from "./env";

export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    requireSupabasePublishableKey(),
  );
}
