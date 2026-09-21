import { AuthForm } from "@/components/auth-form";
export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {

 const { error } = await searchParams;
 return <AuthForm intent="login" title="Sign in" error={error} />;
}
