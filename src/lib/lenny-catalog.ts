/** Episodes in Lenny's Podcast catalog (used for import progress; backfill can grow DB toward this). */
export const LENNY_PODCAST_CATALOG_EPISODES = 289;

/** Category slug for lessons in `LENNY_PODCAST_CATALOG_EPISODES` (imported as core rows). */
export const LENNY_ARCHIVE_CATEGORY_SLUG = "podcast-archive";

/**
 * How many catalog episodes are not yet represented as rows in the podcast-archive category.
 * Pass the count of non-AI lessons in that category only — not all core lessons app-wide.
 */
export function catalogEpisodesNotYetImported(archiveCoreLessonCount: number): number {
  return Math.max(0, LENNY_PODCAST_CATALOG_EPISODES - archiveCoreLessonCount);
}
