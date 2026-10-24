import { Hono } from "hono";

// Vercel deploys the default export as one function pinned to sin1 (see vercel.json).
const app = new Hono();

app.get("/health", (c) =>
  c.json({
    status: "ok",
    region: process.env.VERCEL_REGION ?? "local",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  }),
);

export default app;
