import "server-only";

import type { User } from "@supabase/supabase-js";
import { createSupabaseAdmin } from "@/src/auth/admin";
import { getUser } from "@/src/auth/server";
import type {
  AccountNavUser,
  Profile,
  ProfileRow,
  UpdateProfileInput,
} from "./types";
import {
  getPreferredProfileName,
  getProfileInitials,
  isValidAbsoluteUrl,
  isValidUsername,
  makeUsernameCandidate,
  normalizeUsername,
  sanitizeOptionalText,
  validateProfileInput,
} from "./validation";

const PROFILE_COLUMNS =
  "id, username, display_name, avatar_url, bio, created_at";

type EnsureProfileOptions = {
  preferredUsername?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
};

type UpdateCurrentProfileResult = {
  profile: Profile | null;
  previousUsername: string | null;
  errorMessage: string | null;
};

function mapProfileRowToProfile(row: ProfileRow): Profile {
  const preferredName = getPreferredProfileName({
    displayName: row.display_name,
    username: row.username,
  });

  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    createdAt: row.created_at,
    preferredName,
    initials: getProfileInitials(preferredName),
  };
}

function mapProfileToNavUser(profile: Profile): AccountNavUser {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    preferredName: profile.preferredName,
    initials: profile.initials,
  };
}

async function getProfileById(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile by id:", error);
    return null;
  }

  return data ? mapProfileRowToProfile(data) : null;
}

async function isUsernameTaken(username: string, excludeUserId?: string) {
  const admin = createSupabaseAdmin();
  const query = admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  const { data, error } = await query;

  if (error) {
    console.error("Error checking username availability:", error);
    return false;
  }

  if (!data) return false;
  return data.id !== excludeUserId;
}

async function findAvailableUsername(
  rawCandidate: string | null | undefined,
  excludeUserId?: string,
) {
  const baseUsername = makeUsernameCandidate(rawCandidate);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const suffix = attempt === 0 ? "" : `_${attempt + 1}`;
    const baseLimit = 20 - suffix.length;
    const candidate = `${baseUsername.slice(0, baseLimit)}${suffix}`;

    if (!(await isUsernameTaken(candidate, excludeUserId))) {
      return candidate;
    }
  }

  return `${baseUsername.slice(0, 16)}_${Date.now().toString().slice(-3)}`;
}

function getUserMetadataValue(
  user: User,
  key: "username" | "display_name" | "full_name" | "avatar_url" | "picture",
) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value : null;
}

function getSafeAvatarUrl(value: string | null | undefined) {
  return value && isValidAbsoluteUrl(value) ? value : null;
}

function getFallbackUsernameSource(user: User) {
  const metadataUsername = getUserMetadataValue(user, "username");

  if (metadataUsername) {
    return metadataUsername;
  }

  if (user.email) {
    return user.email.split("@")[0] ?? user.id.slice(0, 8);
  }

  return user.id.slice(0, 8);
}

export async function ensureProfileForUser(
  user: User,
  options: EnsureProfileOptions = {},
) {
  const existingProfile = await getProfileById(user.id);

  if (existingProfile) {
    return existingProfile;
  }

  const admin = createSupabaseAdmin();
  const username = await findAvailableUsername(
    options.preferredUsername ?? getFallbackUsernameSource(user),
    user.id,
  );

  const displayName =
    sanitizeOptionalText(options.displayName) ??
    sanitizeOptionalText(getUserMetadataValue(user, "display_name")) ??
    sanitizeOptionalText(getUserMetadataValue(user, "full_name"));
  const avatarUrl =
    getSafeAvatarUrl(options.avatarUrl) ??
    getSafeAvatarUrl(getUserMetadataValue(user, "avatar_url")) ??
    getSafeAvatarUrl(getUserMetadataValue(user, "picture"));

  const { data, error } = await admin
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio: null,
      },
      { onConflict: "id" },
    )
    .select(PROFILE_COLUMNS)
    .single();

  if (!error && data) {
    return mapProfileRowToProfile(data);
  }

  if (error?.message?.toLowerCase().includes("username")) {
    const retryUsername = await findAvailableUsername(
      `${username}_${user.id.slice(0, 4)}`,
      user.id,
    );
    const retryResult = await admin
      .from("profiles")
      .upsert(
        {
          id: user.id,
          username: retryUsername,
          display_name: displayName,
          avatar_url: avatarUrl,
          bio: null,
        },
        { onConflict: "id" },
      )
      .select(PROFILE_COLUMNS)
      .single();

    if (!retryResult.error && retryResult.data) {
      return mapProfileRowToProfile(retryResult.data);
    }
  }

  console.error("Error ensuring profile row:", error);
  return await getProfileById(user.id);
}

export async function ensureCurrentUserProfile() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return ensureProfileForUser(user);
}

export async function getCurrentProfile() {
  return ensureCurrentUserProfile();
}

export async function getCurrentAccountNavUser() {
  const profile = await getCurrentProfile();
  return profile ? mapProfileToNavUser(profile) : null;
}

export async function getPublicProfileByUsername(username: string) {
  const normalizedUsername = normalizeUsername(username);

  if (!isValidUsername(normalizedUsername)) {
    return null;
  }

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }

  return data ? mapProfileRowToProfile(data) : null;
}

export async function updateCurrentProfile(
  input: UpdateProfileInput,
): Promise<UpdateCurrentProfileResult> {
  const validatedInput = validateProfileInput(input);

  if (!validatedInput.data) {
    return {
      profile: null,
      previousUsername: null,
      errorMessage: validatedInput.errorMessage,
    };
  }

  const user = await getUser();

  if (!user) {
    return {
      profile: null,
      previousUsername: null,
      errorMessage: "You must be signed in to edit your profile.",
    };
  }

  const currentProfile =
    (await getProfileById(user.id)) ?? (await ensureProfileForUser(user));

  if (!currentProfile) {
    return {
      profile: null,
      previousUsername: null,
      errorMessage: "Could not load your profile right now.",
    };
  }

  const { username, displayName, avatarUrl, bio } = validatedInput.data;

  if (await isUsernameTaken(username, user.id)) {
    return {
      profile: null,
      previousUsername: currentProfile.username,
      errorMessage: "That username is already taken.",
    };
  }

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .update({
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
      bio,
    })
    .eq("id", user.id)
    .select(PROFILE_COLUMNS)
    .single();

  if (error) {
    const message = error.message?.toLowerCase() ?? "";

    return {
      profile: null,
      previousUsername: currentProfile.username,
      errorMessage: message.includes("username")
        ? "That username is already taken."
        : "Could not update your profile right now.",
    };
  }

  return {
    profile: mapProfileRowToProfile(data as ProfileRow),
    previousUsername: currentProfile.username,
    errorMessage: null,
  };
}
