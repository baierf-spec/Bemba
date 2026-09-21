import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeDestination } from "@/lib/auth/validation";
import { site } from "@/lib/site";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  let destination = "/auth/error";
  try {
    const code = params.get("code");
    if (code) {
      const client = await createClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error) destination = safeDestination(params.get("next"));
    }
  } catch { /* Safe generic error, without token disclosure. */ }
  return NextResponse.redirect(new URL(destination, site.url), { headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
}
