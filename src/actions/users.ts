"use server";
import { createSupabaseServer } from "../auth/server";
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
    const { auth } = await createSupabaseServer();
    const { error } = await auth.signUp({ email, password });

    if (error) throw error;

    //TODO: Make it check if account already has username .
    // If so then make a custom error message as currently even if acct exists
    // errorMessage will be null

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
    const { error } = await auth.signInWithPassword({ email, password });

    if (error) throw error;

    return { errorMessage: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { errorMessage: message };
  }
}

export async function signOutUserAction() {
  try {
    const { auth } = await createSupabaseServer();
    const { error } = await auth.signOut();

    if (error) throw error;

    return { errorMessage: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { errorMessage: message };
  }
}
