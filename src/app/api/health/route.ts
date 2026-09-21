export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", service: "bemba", scope: "liveness" }, {
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
