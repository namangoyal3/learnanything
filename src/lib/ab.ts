/**
 * Server-side A/B variant reader.
 * Cookie assignment happens in middleware (src/middleware.ts).
 * This function only reads — safe to call in any Server Component.
 */

import { cookies } from "next/headers";

export type ABVariant = "control" | "treatment";

const COOKIE_NAME = "ab_uid";

export async function getVariant(experiment: string): Promise<ABVariant> {
  const jar = await cookies();
  const uid = jar.get(COOKIE_NAME)?.value ?? "";

  // Stable hash: deterministic split on uid + experiment name
  const seed = `${uid}:${experiment}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return hash % 2 === 0 ? "control" : "treatment";
}
