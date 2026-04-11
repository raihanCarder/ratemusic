import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";
import { logger } from "@/src/lib/logger";

function isSupabaseSessionCookie(name: string) {
  return name.startsWith("sb-") && name.includes("auth-token");
}

export async function hasSupabaseSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.getAll().some(({ name }) => isSupabaseSessionCookie(name));
}

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

function isMissingSessionError(message: string) {
  const normalizedMessage = message.toLowerCase();
  return (
    normalizedMessage.includes("auth session missing") ||
    normalizedMessage.includes("session missing")
  );
}

export async function getUser() {
  if (!(await hasSupabaseSessionCookie())) {
    return null;
  }

  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (!isMissingSessionError(error.message)) {
      logger.error("Error fetching current user:", error.message);
    }
    return null;
  }

  return user;
}
