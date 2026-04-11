function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function validateSupabaseUrl(rawUrl: string) {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL: expected a full URL, received "${rawUrl}"`,
    );
  }

  const hasBareOriginPath = parsed.pathname === "" || parsed.pathname === "/";

  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    !hasBareOriginPath ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL: expected a bare project URL like "https://your-project.supabase.co", received "${rawUrl}"`,
    );
  }

  return rawUrl;
}

export function getSupabaseUrl() {
  return validateSupabaseUrl(getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"));
}

export function getSupabasePublishableKey() {
  return getRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

export function getSupabaseServiceRoleKey() {
  return getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}
