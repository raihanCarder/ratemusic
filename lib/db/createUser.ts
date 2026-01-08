import supabase from "../supabase";

type createUserProps = {
  email: string;
  username: string;
  password: string;
};

export default async function createUser({
  email,
  username,
  password,
}: createUserProps) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = data.user;

  if (!user) {
    throw new Error("User not created");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    username,
    display_name: "user",
    avatar_url: "",
    bio: "Welcome to my Profile",
  });

  if (profileError) {
    throw new Error("Username already taken");
  }
}
