import { describe, expect, it } from "vitest";
import { htmlToMarkdown } from "@/lib/md/html";
import { prefersMarkdown } from "@/lib/md/http";
import { isMarkdownRoute, markdownUrl } from "@/lib/md/routes";

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9", true],
    ["text/markdown, */*;q=0.8", true],
    ["*/*", false],
    [null, false],
    ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", false],
    ["text/html, text/markdown;q=0.5", false],
    ["text/markdown;q=0, text/html", false],
  ])("%s → %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });
});

describe("routes", () => {
  it("allowlists content, not app screens or private pages", () => {
    expect(isMarkdownRoute("/pricing")).toBe(true);
    expect(isMarkdownRoute("/learn/pm/some-article")).toBe(true);
    expect(isMarkdownRoute("/dashboard")).toBe(false);
    expect(isMarkdownRoute("/login")).toBe(false);
    expect(markdownUrl("/")).toMatch(/\/index\.md$/);
  });
});

const PAGE = `<html><head><title>T | PM Streak</title><meta name="description" content="Short summary.">
</head><body><header>Site nav</header><main>
<h1>PM A/B Testing<br/>(2026 Edition)</h1>
<p>By <a href="/about">Naman Goyal</a> · Updated July 3, 2026</p>
<a href="/signup">Start free →</a>
<h2>5 Essentials</h2><div><span>1.</span><p>Hypothesis before data</p></div>
<ul><li>One</li><li><b>8</b><span>engines</span></li></ul>
<table><tr><th>Plan</th><th>Price</th></tr><tr><td>Pro</td><td>$6</td></tr></table>
<details><summary>What&amp;apos;s an MDE?</summary><p>The smallest effect worth caring about.</p></details>
<section><h2>Practice now</h2><a href="/signup">Start Free Trial</a></section>
<h2>Related guides</h2><div><a href="/pm-okr-guide">OKR guide <span>Read guide →</span></a><a href="/pm-kpi-guide">KPI guide</a></div>
<script>window.x = 1</script></main><footer>Footer links</footer></body></html>`;

describe("htmlToMarkdown", () => {
  const out = htmlToMarkdown(PAGE, "https://learnanything.pro");

  it("takes the title from <h1> and the summary from the meta description", () => {
    expect(out.title).toBe("PM A/B Testing (2026 Edition)");
    expect(out.description).toBe("Short summary.");
    expect(out.noindex).toBe(false);
    expect(out.body).not.toContain("# PM A/B Testing");
  });

  it("keeps main content as markdown with absolute links", () => {
    expect(out.body).toContain("By [Naman Goyal](https://learnanything.pro/about)");
    expect(out.body).toContain("## 5 Essentials");
    expect(out.body).toContain("- **8** engines");
    expect(out.body).toContain("| Plan | Price |\n| --- | --- |\n| Pro | $6 |");
    expect(out.body).toContain("### What's an MDE?\n\nThe smallest effect worth caring about.");
    expect(out.body).toContain("1. Hypothesis before data");
    expect(out.body).toContain(
      "- [OKR guide](https://learnanything.pro/pm-okr-guide)\n- [KPI guide](https://learnanything.pro/pm-kpi-guide)",
    );
  });

  it("drops chrome, scripts, signup CTAs and the headings they leave empty", () => {
    expect(out.body).not.toMatch(/Site nav|Footer links|window\.x|signup|Start free/);
    expect(out.body).not.toContain("Practice now");
  });

  it("flags noindex pages", () => {
    const noindex = htmlToMarkdown('<head><meta name="robots" content="noindex, follow"></head><main><h1>x</h1></main>', "https://x.test");
    expect(noindex.noindex).toBe(true);
  });
});
