import { requireAccount } from "@/lib/auth/access";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateProfile } from "./actions";
export default async function Settings({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
 const { supabase, user } = await requireAccount();
 const { data, error } = await supabase.from("profiles").select("display_name").eq("id",user.id).single();
 if(error) throw new Error("Could not load profile");
 const status=await searchParams;
 return <main id="main" className="mx-auto min-h-[60vh] max-w-xl px-5 py-12"><Card><h1 className="font-display text-3xl">Account settings</h1>{status.error && <p role="alert">We couldn’t save your changes.</p>}{status.saved && <p role="status">Profile saved.</p>}<form action={updateProfile} className="mt-6 space-y-5"><label className="block">Your name<input name="display_name" defaultValue={data.display_name} maxLength={120} required className="mt-2 block w-full rounded-lg border border-border p-3" /></label><Button>Save profile</Button></form></Card></main>;
}
