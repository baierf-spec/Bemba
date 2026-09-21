import type { Metadata } from "next";
import { requireAccount } from "@/lib/auth/access";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Layout({ children }: { children: React.ReactNode }) {
 await requireAccount({ active: true, admin: false });
 return children;
}
