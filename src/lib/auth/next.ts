export function normalizeNextPath(next: string | null | undefined) {
  const trimmed = next?.trim();

  if (!trimmed) {
    return null;
  }

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}

export function buildAuthHref(
  pathname: string,
  next: string | null | undefined,
) {
  const normalizedNext = normalizeNextPath(next);

  if (!normalizedNext) {
    return pathname;
  }

  return `${pathname}?${new URLSearchParams({ next: normalizedNext }).toString()}`;
}
