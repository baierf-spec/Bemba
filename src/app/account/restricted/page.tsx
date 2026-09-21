import { requireAccount } from "@/lib/auth/access";
import { Button } from "@/components/ui/button";
export const dynamic="force-dynamic";
export const metadata={robots:{index:false,follow:false}};
export default async function Restricted() {
 const {access}=await requireAccount({active:false});
 return <main id="main" className="mx-auto min-h-[60vh] max-w-xl px-5 py-12"><h1 className="font-display text-3xl">Account access</h1><p className="mt-6">Status: {access.status}</p>{access.reason && <p>{access.reason}</p>}<form action="/auth/session" method="post" className="mt-6"><input type="hidden" name="intent" value="logout" /><Button>Sign out</Button></form></main>;
}
