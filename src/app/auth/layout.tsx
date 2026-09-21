import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Account" };
export const dynamic = "force-dynamic";
export default function AuthLayout({ children }: { children: React.ReactNode }) { return children; }
