import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAccount(options: { active?: boolean; admin?: boolean } = { active: true }) {
  const supabase = await createClient({ readOnly: true });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error && error.status && error.status >= 500) throw new Error("Authentication service unavailable");
  if (!user) redirect("/auth/login");
  if (!user.email_confirmed_at) redirect("/auth/check-email");
  const { data, error: accessError } = await supabase.rpc("get_account_access");
  if (accessError || !data?.[0]) throw new Error("Account permissions could not be loaded");
  const access = data[0] as { role: string; status: string; reason: string | null };
  if (options.active !== false && access.status !== "active") redirect("/account/restricted");
  if (options.admin) {
    if (access.role !== "admin" || access.status !== "active") redirect("/auth/forbidden");
    const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) throw new Error("Could not verify authentication assurance");
    if (assurance.currentLevel !== "aal2") redirect("/auth/mfa");
  }
  return { supabase, user, access };
}
