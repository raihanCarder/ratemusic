"use server";

import createUser from "@/lib/db/createUser";

type createNewUserProps = {
  email: string;
  password: string;
  username: string;
};

export default async function signUpUser({
  email,
  password,
  username,
}: createNewUserProps) {
  try {
    await createUser({ email, username, password });
    return { success: true, message: "success" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { success: false, message: message as string };
  }
}
