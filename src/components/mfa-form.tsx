"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
export function MfaForm() {
 const router=useRouter();
 const [factor,setFactor]=useState(""); const [secret,setSecret]=useState(""); const [code,setCode]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 async function setup() {
  setBusy(true);setError("");
  try {
   const client=createClient();const factors=await client.auth.mfa.listFactors();if(factors.error) throw factors.error;
   const existing=factors.data.totp.find(f=>f.status==="verified");
   if(existing){setFactor(existing.id);return;}
   const enrollment=await client.auth.mfa.enroll({factorType:"totp",friendlyName:`Bemba authenticator ${Date.now()}`});if(enrollment.error)throw enrollment.error;
   setFactor(enrollment.data.id);setSecret(enrollment.data.totp.secret);
  }catch{setError("Could not set up your authenticator. Please try again.");}finally{setBusy(false);}
 }
 async function verify(event:React.FormEvent) {
  event.preventDefault();setBusy(true);setError("");
  try{const client=createClient();const result=await client.auth.mfa.challengeAndVerify({factorId:factor,code});if(result.error)throw result.error;router.push("/admin");router.refresh();}
  catch{setError("Verification failed. Check the current six-digit code.");}finally{setBusy(false);}
 }
 return <Card><h1 className="font-display text-3xl">Secure administrator access</h1><p className="my-4">Use an authenticator app to verify your identity.</p>{error&&<p role="alert">{error}</p>}{!factor?<Button onClick={setup} disabled={busy}>Set up or verify authenticator</Button>:<form onSubmit={verify} className="space-y-4">{secret&&<p>Enter this setup key in your authenticator app: <code className="block break-all select-all">{secret}</code></p>}<label className="block">Six-digit code<input className="mt-2 block rounded-lg border p-3" value={code} onChange={e=>setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6}/></label><Button disabled={busy}>Verify</Button></form>}</Card>;
}
