import assert from "node:assert/strict";

const base = process.env.SMOKE_URL || "http://127.0.0.1:3000";
const checks = [
  ["/", 200, /Your business/],
  ["/pricing", 200, /not available yet/],
  ["/does-not-exist", 404, /This page/],
  ["/robots.txt", 200, /Disallow: \//],
];
for (const [path, status, pattern] of checks) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, status, path);
  assert.match(await response.text(), pattern, path);
  assert.match(response.headers.get("x-robots-tag") || "", /noindex/, path);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff", path);
  console.log(`PASS ${status} ${path}`);
}
const health = await fetch(new URL("/api/health", base));
assert.equal(health.status, 200);
assert.equal(health.headers.get("cache-control"), "no-store");
assert.deepEqual(await health.json(), { status: "ok", service: "bemba", scope: "liveness" });
console.log("PASS liveness (not database readiness)");
const sitemap = await fetch(new URL("/sitemap.xml", base));
assert.equal(sitemap.status, 200);
assert.doesNotMatch(await sitemap.text(), /<loc>/);
console.log("PASS staging sitemap has no indexable URLs");
