import { requireAccount } from "@/lib/auth/access";
import { MfaForm } from "@/components/mfa-form";
export default async function MfaPage() { await requireAccount(); return <main id="main" className="mx-auto min-h-[60vh] max-w-xl px-5 py-12"><MfaForm /></main>; }
