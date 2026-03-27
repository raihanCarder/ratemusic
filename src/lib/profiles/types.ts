export type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  preferredName: string;
  initials: string;
};

export type AccountNavUser = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  preferredName: string;
  initials: string;
};

export type UpdateProfileInput = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
};

