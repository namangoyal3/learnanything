# Prune runbook (generated — human deploys each step)

Manifest: scripts/seo/prune-manifest.json (642 → noindex, 751 keep, visible% after ≈ 2.9)

1. src/middleware.ts sets X-Robots-Tag: noindex for every path in src/data/pruned-urls.json (src/lib/pruned.ts). Pages stay live and reversible.
2. src/app/sitemap.ts omits those paths — the sitemap lists only the keep set.
3. /sitemap-removed.xml lists the noindexed URLs. Submit it in Search Console; delete src/app/sitemap-removed.xml ~4-6 weeks after deploy.
4. lastmod must stay truthful — do not touch lastmod on surviving pages.
5. DB rows for /learn/pm/* articles stay published=true — the header covers them. Do NOT hard-delete.
6. After 60 days, if a path is still noindexed and nobody reversed it, it may become a 410 — a separate, human-run step.

Rewrite, do not remove: the manifest's `rewrite` list holds hand-built pages that scored below the line.

Expect visible% and impressions on the keep set to move over 2-6 months, step-changes around core updates.
