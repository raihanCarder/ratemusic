import { redirect } from "next/navigation";

export default function Home() {
  /*
    Default page upon entering site is currently discovery page names as "feed"
  */
  redirect("/feed");
}
