import { redirect } from "next/navigation";
import ProfilePageView from "@/src/components/ProfilePageView";
import { getCurrentProfile } from "@/src/lib/profiles/server";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/signin");
  }

  return <ProfilePageView profile={profile} editable />;
}

