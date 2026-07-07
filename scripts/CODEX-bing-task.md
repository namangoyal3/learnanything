# Codex task: finish Bing Webmaster verification for learnanything.pro

## Goal
Verify **learnanything.pro** in Bing Webmaster Tools via "Import from Google
Search Console" and submit its sitemap. This is the last manual SEO step; the
GEO pages, IndexNow push (951 URLs accepted), and GSC sitemap resubmit are all
already live.

## How
A ready script exists: `scripts/bing-gsc-import.mjs`. It drives the user's REAL
Chrome profile (already signed into Google as namangoyal21197@gmail.com) with
Playwright — no passwords are typed or stored. Run it, watch the headed window,
and if any Bing UI selector has drifted, finish that one click by hand when the
script pauses.

```bash
cd ~/pmstreak
osascript -e 'quit app "Google Chrome"'   # profile must be unlocked
node scripts/bing-gsc-import.mjs
```

## Prereqs
- Google Chrome fully quit (script attaches its `Default` profile).
- Playwright is already in the repo (`playwright@1.58.2`). The script uses
  `channel: "chrome"` (your installed Google Chrome, not a bundled browser), so
  no `playwright install` is needed.

## If selectors drifted
BWT changes its DOM often. The script screenshots every step to `/tmp/bing-*.png`
and pauses instead of hard-failing. Read the screenshot, update the selector
arrays in `clickFirst(...)` calls (they're plain text/`:has-text()` locators),
and re-run. The four checkpoints are: Google "Continue", the "Import" card,
selecting the `learnanything.pro` property, and the Sitemaps "Submit" dialog.

## Success = 
1. learnanything.pro shows **Verified** in BWT (auto-verifies through GSC
   ownership — no DNS/HTML step needed).
2. `https://learnanything.pro/sitemap.xml` listed under Sitemaps.

## Note (not blocking)
Bing already ingests the site via IndexNow (key file live, 951 URLs accepted).
This step adds BWT metrics/visibility and manual sitemap control — it's the
nice-to-have, not the unblocker. Don't spend more than a couple of iterations on
selector drift; if BWT fights you, the user can do the 4 clicks manually.
