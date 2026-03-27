import type { UpdateProfileInput } from "./types";

export const PROFILE_USERNAME_REGEX = /^[a-z][a-z0-9_]{2,19}$/;
export const MAX_DISPLAY_NAME_LENGTH = 40;
export const MAX_BIO_LENGTH = 160;

type ValidatedProfileInput = {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string) {
  return PROFILE_USERNAME_REGEX.test(normalizeUsername(username));
}

export function isValidAbsoluteUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export function getPreferredProfileName(profile: {
  displayName: string | null;
  username: string;
}) {
  return profile.displayName?.trim() || profile.username;
}

export function getProfileInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "MU";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function makeUsernameCandidate(value: string | null | undefined) {
  const fallback = value?.trim().toLowerCase() || "musicfan";
  let candidate = fallback
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!candidate) {
    candidate = "musicfan";
  }

  if (!/^[a-z]/.test(candidate)) {
    candidate = `u_${candidate}`;
  }

  candidate = candidate.slice(0, 20).replace(/_+$/g, "");

  while (candidate.length < 3) {
    candidate = `${candidate}x`;
  }

  if (!/^[a-z]/.test(candidate)) {
    candidate = `u${candidate}`.slice(0, 20);
  }

  return candidate;
}

export function validateProfileInput(
  input: UpdateProfileInput,
): { data: ValidatedProfileInput | null; errorMessage: string | null } {
  const username = normalizeUsername(input.username);
  const displayName = sanitizeOptionalText(input.displayName);
  const avatarUrl = sanitizeOptionalText(input.avatarUrl);
  const bio = sanitizeOptionalText(input.bio);

  if (!isValidUsername(username)) {
    return {
      data: null,
      errorMessage:
        "Usernames must be 3-20 characters and can contain only lowercase letters, numbers, and underscores.",
    };
  }

  if (displayName && displayName.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      data: null,
      errorMessage: `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`,
    };
  }

  if (bio && bio.length > MAX_BIO_LENGTH) {
    return {
      data: null,
      errorMessage: `Bio must be ${MAX_BIO_LENGTH} characters or fewer.`,
    };
  }

  if (avatarUrl && !isValidAbsoluteUrl(avatarUrl)) {
    return {
      data: null,
      errorMessage: "Avatar URL must be a valid http or https link.",
    };
  }

  return {
    data: {
      username,
      displayName,
      avatarUrl,
      bio,
    },
    errorMessage: null,
  };
}

