"use server";
import { requireAccount } from "@/lib/auth/access";
import { profileName } from "@/lib/auth/validation";
import { redirect } from "next/navigation";
export async function updateProfile(form: FormData) {
  const { supabase, user } = await requireAccount();
  let failed = false;
  try {
    const display_name = profileName(form.get("display_name"));
    const { data, error } = await supabase.from("profiles").update({ display_name }).eq("id", user.id).select("id").single();
    failed = !!error || !data;
  } catch { failed = true; }
  redirect(failed ? "/dashboard/settings?error=save_failed" : "/dashboard/settings?saved=1");
}
