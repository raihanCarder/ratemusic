import { getCurrentAccountNavUser } from "../lib/profiles/server";
import NavClient from "./NavClient";

export default async function Nav() {
  /*
    Server side Nav so that account state can be loaded without client-side auth calls.
  */

  const account = await getCurrentAccountNavUser();

  return <NavClient account={account} />;
}
