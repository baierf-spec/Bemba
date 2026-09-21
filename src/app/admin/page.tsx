import { requireAccount } from "@/lib/auth/access";
import { Card } from "@/components/ui/card";
export default async function Admin() {
 const { supabase }=await requireAccount({active:true,admin:true});
 const result=await supabase.from("stores").select("id",{count:"exact",head:true});
 if(result.error) throw new Error("Could not load administrator statistics");
 return <main id="main" className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12"><h1 className="font-display text-4xl">Administration</h1><Card className="mt-6"><p>Stores: {result.count ?? 0}</p><p className="mt-3 text-muted-foreground">Administrator access is protected by a database role and multi-factor authentication. Moderation workflows are scheduled for M5.</p></Card></main>;
}
