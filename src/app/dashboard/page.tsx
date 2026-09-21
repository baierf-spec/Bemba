import Link from "next/link";
import { requireAccount } from "@/lib/auth/access";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default async function Dashboard() {
  const { supabase, user } = await requireAccount();
  const [profile, store] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase.from("stores").select("id,name,publication").eq("owner_id", user.id).maybeSingle(),
  ]);
  if (profile.error || store.error) throw new Error("Your account could not be loaded");
  return <main id="main" className="mx-auto min-h-[65vh] max-w-4xl px-5 py-12"><h1 className="font-display text-4xl">Welcome, {profile.data.display_name || "seller"}</h1><Card className="my-6"><h2 className="text-xl font-semibold">Your account</h2><p className="my-3">{user.email}</p>{store.data ? <p>{store.data.name} · {store.data.publication}</p> : <p>You haven’t created a storefront yet. Store setup will be available in the next development milestone.</p>}</Card><Link className="underline" href="/dashboard/settings">Account settings</Link><form className="mt-6" method="post" action="/auth/session"><input type="hidden" name="intent" value="logout" /><Button variant="outline">Sign out</Button></form></main>;
}
