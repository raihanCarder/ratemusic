/**
 * Shared database error utilities used across Supabase modules.
 */

export function isUniqueViolationError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as {
    code?: unknown;
    message?: unknown;
    details?: unknown;
  };
  const code = typeof maybeError.code === "string" ? maybeError.code : "";
  const message =
    typeof maybeError.message === "string"
      ? maybeError.message.toLowerCase()
      : "";
  const details =
    typeof maybeError.details === "string"
      ? maybeError.details.toLowerCase()
      : "";

  return (
    code === "23505" ||
    message.includes("duplicate key") ||
    details.includes("duplicate key")
  );
}

export function formatSupabaseError(error: unknown) {
  if (!error || typeof error !== "object") {
    return error;
  }

  const maybeError = error as {
    code?: unknown;
    message?: unknown;
    details?: unknown;
    hint?: unknown;
  };

  return {
    code: typeof maybeError.code === "string" ? maybeError.code : "",
    message: typeof maybeError.message === "string" ? maybeError.message : "",
    details: typeof maybeError.details === "string" ? maybeError.details : "",
    hint: typeof maybeError.hint === "string" ? maybeError.hint : "",
  };
}
