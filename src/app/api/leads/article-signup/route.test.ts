import { describe, it, expect, vi } from "vitest";

// The ctrl+all landing page (hosted on another origin) posts its waitlist
// here. Allowed origins get CORS headers; everything else gets none, so the
// browser keeps enforcing same-origin for unknown sites.

const upsert = vi.fn(async () => ({}));
vi.mock("@/lib/prisma", () => ({ prisma: { articleLead: { upsert: (...a: unknown[]) => upsert(...a) } } }));

function req(origin: string | null, body?: unknown) {
  const headers = new Headers();
  if (origin) headers.set("origin", origin);
  return new Request("https://learnanything.pro/api/leads/article-signup", {
    method: body ? "POST" : "OPTIONS",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("article-signup CORS", () => {
  it("answers preflight from an allowed origin", async () => {
    const { OPTIONS } = await import("./route");
    const res = await OPTIONS(req("https://namangoyal3.github.io"));
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://namangoyal3.github.io");
    expect(res.headers.get("vary")).toBe("Origin");
  });

  it("gives an unknown origin no CORS headers", async () => {
    const { OPTIONS, POST } = await import("./route");
    const pre = await OPTIONS(req("https://evil.example"));
    expect(pre.headers.get("access-control-allow-origin")).toBeNull();
    const post = await POST(req("https://evil.example", { email: "a@b.co", articleSlug: "x", vertical: "y" }));
    expect(post.status).toBe(200);
    expect(post.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("keeps CORS headers on the 400 and the 200", async () => {
    const { POST } = await import("./route");
    const bad = await POST(req("https://namangoyal3.github.io", { email: "nope" }));
    expect(bad.status).toBe(400);
    expect(bad.headers.get("access-control-allow-origin")).toBe("https://namangoyal3.github.io");
    const ok = await POST(req("https://namangoyal3.github.io", { email: "a@b.co", articleSlug: "ctrlall-waitlist", vertical: "ctrlall" }));
    expect(ok.status).toBe(200);
    expect(upsert).toHaveBeenCalled();
  });
});
