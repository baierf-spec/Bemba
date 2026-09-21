import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Edge-compatible middleware retained for the OpenNext adapter. Server guards remain authoritative.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, { cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    } });
    try { await supabase.auth.getUser(); }
    catch { /* Protected server guards fail closed; public auth UI remains reachable. */ }
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
export const config = { matcher: ["/auth/:path*", "/dashboard/:path*", "/admin/:path*", "/account/:path*", "/onboarding/:path*"] };
