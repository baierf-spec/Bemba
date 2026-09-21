import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Seller plans", alternates: { canonical: "/pricing" } };

export default function Pricing() {
  return (
    <main id="main" className="mx-auto min-h-[65vh] max-w-4xl px-5 py-16 sm:px-8">
      <p className="text-xs font-bold tracking-widest text-primary uppercase">For sellers</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">A storefront for your business.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Bemba will offer seller subscriptions and optional product promotions. Plan prices and limits will be published before paid plans become available.</p>
      <Card className="mt-8"><h2 className="text-xl font-semibold">Payments stay between you and your customer.</h2><p className="mt-3 leading-7 text-muted-foreground">Bemba helps customers discover your products and contact you on WhatsApp. You arrange product payment, pickup or delivery directly with them.</p></Card>
      <p className="mt-6 text-sm text-muted-foreground">Paid subscriptions and promotions are not available yet.</p>
    </main>
  );
}
