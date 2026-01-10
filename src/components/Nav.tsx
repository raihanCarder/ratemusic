import { getUser } from "../auth/server";
import NavClient from "./NavClient";

export default async function Nav() {
  /*
    Server side Nav so that I can user getUser and get user on server instead of on Client.
  */

  const user = await getUser();

  return <NavClient user={user} />;
}
