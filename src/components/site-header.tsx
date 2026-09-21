import Link from "next/link";
import { Sprout } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" aria-label="Bemba home" className="flex items-center gap-2 text-2xl font-bold tracking-tight"><Sprout className="text-primary" aria-hidden="true" />Bemba</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium">
          <Link href="/#how-it-works" className="hover:text-primary">How it works</Link>
          <Link href="/pricing" className="hover:text-primary">Pricing</Link>
        </nav>
      </div>
    </header>
  );
}
