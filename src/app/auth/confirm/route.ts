import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeDestination } from "@/lib/auth/validation";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const hash = params.get("token_hash");
  const type = params.get("type");
  let destination = "/auth/error";
  try {
    if (hash && (type === "signup" || type === "recovery" || type === "email_change")) {
      const client = await createClient();
      const { error } = await client.auth.verifyOtp({ token_hash: hash, type });
      if (!error) destination = type === "recovery" ? "/auth/reset-password" : safeDestination(null);
    }
  } catch { /* Never return tokens or provider errors. */ }
  return NextResponse.redirect(new URL(destination, request.url), { headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
}
