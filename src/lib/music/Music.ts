import { MusicService } from "./MusicService";
import { Supabase } from "./Supabase";
import { MockProvider } from "./testing/MockProvider";

let musicService: MusicService | null = null;

export default function getMusicService() {
  if (musicService) return musicService;

  const provider = new MockProvider();
  const db = new Supabase();

  musicService = new MusicService(provider, db);
  return musicService;
}
