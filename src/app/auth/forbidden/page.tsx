import Link from "next/link";
export default function Page() { return <main id="main" className="mx-auto min-h-[60vh] max-w-xl px-5 py-14"><h1 className="font-display text-3xl">Access restricted</h1><p className="my-6">This account does not have permission to open the administrator area.</p><Link href="/auth/login" className="underline">Back to sign in</Link></main>; }
