"use server";

import { revalidatePath } from "next/cache";
import { updateCurrentProfile } from "@/src/lib/profiles/server";
import type { UpdateProfileInput } from "@/src/lib/profiles/types";

export async function updateCurrentProfileAction(input: UpdateProfileInput) {
  const result = await updateCurrentProfile(input);

  if (!result.profile) {
    return { errorMessage: result.errorMessage };
  }

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/settings");
  revalidatePath(`/u/${result.profile.username}`);

  if (
    result.previousUsername &&
    result.previousUsername !== result.profile.username
  ) {
    revalidatePath(`/u/${result.previousUsername}`);
  }

  return {
    errorMessage: null,
    profile: result.profile,
  };
}

