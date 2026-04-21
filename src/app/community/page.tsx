import CommunityPageView from "@/src/components/CommunityPageView";
import { getCommunityProfiles } from "@/src/lib/profiles/server";

export default async function CommunityPage() {
  const profiles = await getCommunityProfiles();

  return <CommunityPageView profiles={profiles} />;
}
