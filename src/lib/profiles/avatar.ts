const DICEBEAR_STYLE = "thumbs";

export function buildGeneratedAvatarUrl(seed: string) {
  const params = new URLSearchParams({
    seed,
    radius: "50",
    backgroundColor: "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
  });

  return `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/svg?${params.toString()}`;
}

export function createRandomAvatarSeed(username: string) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return `${username}-${randomPart}`;
}
