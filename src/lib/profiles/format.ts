export function formatJoinedDate(createdAt: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(createdAt));
  } catch {
    return "Recently";
  }
}
