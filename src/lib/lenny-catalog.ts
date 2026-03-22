/** Episodes in Lenny's Podcast catalog (used for import progress; backfill can grow DB toward this). */
export const LENNY_PODCAST_CATALOG_EPISODES = 289;

export function catalogEpisodesNotYetImported(coreLessonCount: number): number {
  return Math.max(0, LENNY_PODCAST_CATALOG_EPISODES - coreLessonCount);
}
