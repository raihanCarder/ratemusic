import { notFound } from "next/navigation";
import ProfilePageView from "@/src/components/ProfilePageView";
import { getPublicProfileByUsername } from "@/src/lib/profiles/server";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return <ProfilePageView profile={profile} />;
}

