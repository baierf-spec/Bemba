import { AuthForm } from "@/components/auth-form";
import { requireAccount } from "@/lib/auth/access";
export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
 await requireAccount({ active: false });
 const { error } = await searchParams;
 return <AuthForm intent="reset" title="Set a new password" error={error} />;
}
