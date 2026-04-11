import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

export function createSupabaseClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublishableKey()
  );
}
