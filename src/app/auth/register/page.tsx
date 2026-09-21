import { AuthForm } from "@/components/auth-form";
export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {

 const { error } = await searchParams;
 return <AuthForm intent="register" title="Create your seller account" error={error} />;
}
