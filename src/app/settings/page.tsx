import { redirect } from "next/navigation";
import SettingsClient from "./_components/SettingsClient";
import { getCurrentProfile } from "@/src/lib/profiles/server";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/signin");
  }

  return (
    <SettingsClient profile={profile} />
  );
}
