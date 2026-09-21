import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { credentials, profileName } from "@/lib/auth/validation";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  const go = (path: string) => NextResponse.redirect(new URL(path, site.url), { status: 303, headers: { "Cache-Control": "private, no-store" } });
  if (request.headers.get("origin") !== site.url.origin) return new Response("Forbidden", { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 8192) return new Response("Payload too large", { status: 413 });
  try {
    const form = await request.formData();
    const intent = String(form.get("intent"));
    const supabase = await createClient();
    if (intent === "register") {
      const input = credentials(form);
      const display_name = profileName(form.get("display_name"));
      const { error } = await supabase.auth.signUp({ ...input, options: { data: { display_name }, emailRedirectTo: new URL("/auth/confirm", site.url).href } });
      if (error) return go("/auth/register?error=signup_failed");
      return go("/auth/check-email");
    }
    if (intent === "login") {
      const { error } = await supabase.auth.signInWithPassword(credentials(form));
      return go(error ? "/auth/login?error=invalid_credentials" : "/dashboard");
    }
    if (intent === "logout") {
      const { error } = await supabase.auth.signOut();
      return go(error ? "/auth/error" : "/auth/login");
    }
    if (intent === "recover") {
      const email = String(form.get("email") ?? "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254) return go("/auth/forgot-password?error=invalid_input");
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: new URL("/auth/confirm?next=/auth/reset-password", site.url).href });
      if (error && error.status && error.status >= 500) return go("/auth/error");
      return go("/auth/check-email");
    }
    if (intent === "reset") {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return go("/auth/login");
      const password = String(form.get("password") ?? "");
      if (password.length < 12 || password.length > 128) return go("/auth/reset-password?error=invalid_input");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) return go("/auth/reset-password?error=update_failed");
      const { error: signoutError } = await supabase.auth.signOut({ scope: "global" });
      return go(signoutError ? "/auth/error" : "/auth/login");
    }
    return new Response("Invalid action", { status: 400 });
  } catch (error) {
    return go(error instanceof Error && error.message === "invalid_input" ? "/auth/login?error=invalid_input" : "/auth/error");
  }
}
