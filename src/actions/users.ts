"use server";

import { createSupabaseAdmin } from "../auth/admin";
import { createSupabaseServer } from "../auth/server";
import { ensureProfileForUser } from "../lib/profiles/server";
import { isValidUsername, normalizeUsername } from "../lib/profiles/validation";

type signUpUserActionProp = {
  email: string;
  password: string;
  username: string;
};

type signInUserActionProp = {
  email: string;
  password: string;
};

export async function signUpUserAction({
  username,
  email,
  password,
}: signUpUserActionProp) {
  try {
    const normalizedUsername = normalizeUsername(username);

    if (!isValidUsername(normalizedUsername)) {
      return {
        errorMessage:
          "Usernames must be 3-20 characters and can contain only lowercase letters, numbers, and underscores.",
      };
    }

    const admin = createSupabaseAdmin();
    const { data: existingProfile, error: existingProfileError } = await admin
      .from("profiles")
      .select("id")
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (existingProfileError) {
      return { errorMessage: "Could not create your account right now." };
    }

    if (existingProfile) {
      return { errorMessage: "That username is already taken." };
    }

    const supabase = await createSupabaseServer();

    const { data, error: SignUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: normalizedUsername,
        },
      },
    });

    if (SignUpError) {
      const usernameAlreadyExists =
        SignUpError.message?.includes("duplicate") ||
        SignUpError.message?.includes("username") ||
        "Database error saving new user";

      if (usernameAlreadyExists) {
        return { errorMessage: "That username is already taken." };
      }

      return {
        errorMessage: SignUpError.message,
      };
    }

    const emailInDatabase = data.user && data.user.identities?.length === 0;

    if (emailInDatabase) {
      return {
        errorMessage: "If you already have an account, try signing in.",
      };
    }

    if (data.user) {
      await ensureProfileForUser(data.user, {
        preferredUsername: normalizedUsername,
      });
    }

    return { errorMessage: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { errorMessage: message };
  }
}

export async function signInUserAction({
  email,
  password,
}: signInUserActionProp) {
  try {
    const { auth } = await createSupabaseServer();
    const { error: SignInError } = await auth.signInWithPassword({
      email,
      password,
    });

    if (SignInError) return { errorMessage: SignInError.message };

    return { errorMessage: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { errorMessage: message };
  }
}

export async function signOutUserAction() {
  try {
    const { auth } = await createSupabaseServer();
    const { error: SignOutError } = await auth.signOut();

    if (SignOutError) return { errorMessage: SignOutError.message };

    return { errorMessage: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { errorMessage: message };
  }
}
