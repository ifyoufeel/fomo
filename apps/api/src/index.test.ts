import { afterEach, describe, expect, it, vi } from "vitest";

import app from "./index.js";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /health", () => {
  it("reports the serving region and commit", async () => {
    vi.stubEnv("VERCEL_REGION", "sin1");
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "abc123");

    const res = await app.request("/health");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", region: "sin1", commit: "abc123" });
  });

  it("falls back when not running on Vercel", async () => {
    vi.stubEnv("VERCEL_REGION", undefined);
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", undefined);

    const res = await app.request("/health");

    expect(await res.json()).toEqual({ status: "ok", region: "local", commit: null });
  });

  it("returns 404 for unknown routes", async () => {
    const res = await app.request("/nope");

    expect(res.status).toBe(404);
  });
});
