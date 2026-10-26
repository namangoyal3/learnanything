import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { PUBLIC_ROUTES } from "@/lib/seo/public-routes";
import pageDates from "../../scripts/seo-page-dates.json";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://learnanything.pro";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Real git-derived dates from scripts/seo-page-dates.json (regenerate via
  // scripts/generate-seo-page-dates.mjs): published = oldest commit, modified
  // = newest non-bulk commit. The sitemap uses `modified`; routes missing
  // from the manifest keep `now` as their lastModified.
  const gitDates: Record<string, { published: string; modified: string }> = pageDates;
  const staticRoutesWithGitDates: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const path = route.url.slice(siteUrl.length) || "/";
    return gitDates[path]
      ? { ...route, lastModified: new Date(gitDates[path].modified) }
      : route;
  });

  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, vertical: true, updatedAt: true },
  });
  
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/learn/${a.vertical}/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutesWithGitDates, ...articleRoutes];
}
