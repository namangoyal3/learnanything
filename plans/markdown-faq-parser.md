# Plan: Reconcile the HowTo markdown contract (quarantined test)

- **Priority**: P3 · **Effort**: S–M · **Risk**: MED (changes live GEO JSON-LD)
- **Category**: tech-debt / correctness · **Planned at**: `afc2a77`, 2026-06-11

## Why

`src/lib/__tests__/markdown-faq.test.ts` has one quarantined test
(`extractHowToSteps > converts a ## How to section into HowToStep entries`,
`it.skip`). It asserts a `### Step:` heading format with a `?`-appended step
name, but real GEO articles author HowTo sections as numbered bold lists
(`1. **Step name**: description`), which `extractHowToSteps` in
`src/lib/geo/markdown-faq.ts` already parses correctly. Aligning the parser to
the test would regress production extraction; aligning the test to the parser
loses whatever intent the `### Step` format had. This needs a human decision on
the intended HowTo authoring contract, verified against the real article corpus.

## What was already fixed (do not redo)

The four FAQ tests were a real bug and are fixed: the section regex used `\s*$`
(with `m`), which captured an empty section at the first blank line, so FAQ
JSON-LD came out empty for the common `## FAQ\n\n### Question` format. The
parser now matches `## FAQ` / `## Frequently Asked Questions`, terminates on the
next `\n## ` or true end-of-string, and supports `###`, `**Bold question?**`,
and `**Q:**/**A:**` strategies. All four FAQ tests pass.

## Decision needed

1. Inspect the real article corpus (`seo-articles/*.json|mdx`, `seo-drafts/`):
   do any author HowTo as `### Step` headings, or are they all numbered bold?
   `grep -l "## How to" seo-articles/* seo-drafts/*` then inspect format.
2. If all real articles use numbered bold → delete the quarantined test (the
   parser is correct); optionally add a test for the real numbered-bold format.
3. If `### Step` is a desired authored format → extend `extractHowToSteps` with a
   second strategy (parse `### ` headings under a `## How to` section) WITHOUT
   removing the numbered-bold strategy, and decide whether the `?`-append in the
   test is intended (it looks wrong for a HowTo step name — likely the test
   should not expect it).

## Done criteria

- [ ] Decision recorded; quarantined test either deleted or un-skipped + passing
- [ ] `npx vitest run src/lib/__tests__/markdown-faq.test.ts` → all pass, 0 skipped
- [ ] Verified `extractHowToSteps` still extracts steps from a real article (spot-check the rendered JSON-LD on a `/learn/[vertical]/[slug]` page)
