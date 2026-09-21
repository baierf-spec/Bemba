import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Store, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-5 text-xs font-bold tracking-[0.18em] text-primary uppercase">Built for local business · Zambia</p>
          <h1 className="font-display text-5xl leading-[1.04] tracking-tight sm:text-7xl">Your business.<br />Your store.<br /><span className="text-primary">More possibilities.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">A home for your products. A place to discover local businesses. A direct conversation on WhatsApp.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link href="#how-it-works">See how Bemba works <ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline"><Link href="/pricing">About seller plans</Link></Button>
          </div>
        </div>
        <Card className="relative overflow-hidden border-0 bg-secondary p-8 sm:p-10">
          <span className="inline-flex rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">In development</span>
          <Store className="my-7 size-12 text-primary" strokeWidth={1.3} aria-hidden="true" />
          <h2 className="font-display text-3xl leading-tight">Small businesses.<br />A place to grow.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Bemba is being built for sellers and shoppers in Zambia. Store registration and product discovery are not open yet.</p>
          <div className="mt-7 border-t border-primary/15 pt-5 text-sm leading-6 text-primary">Your storefront will bring your products and business details together, with a clear way for customers to contact you.</div>
        </Card>
      </section>
      <section id="how-it-works" className="scroll-mt-8 border-t border-border py-12">
        <p className="text-xs font-bold tracking-widest text-primary uppercase">The Bemba approach</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">From discovery to a conversation.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card><Store className="mb-5 text-primary" aria-hidden="true" /><h3 className="text-lg font-bold">1. Create your storefront</h3><p className="mt-3 leading-7 text-muted-foreground">Introduce your business with your own brand, photos and contact details.</p></Card>
          <Card><Sparkles className="mb-5 text-primary" aria-hidden="true" /><h3 className="text-lg font-bold">2. Share your products</h3><p className="mt-3 leading-7 text-muted-foreground">Publish a clear catalog that customers can explore on Bemba.</p></Card>
          <Card><MessageCircle className="mb-5 text-primary" aria-hidden="true" /><h3 className="text-lg font-bold">3. Talk on WhatsApp</h3><p className="mt-3 leading-7 text-muted-foreground">Customers contact you directly to ask about availability and arrange a purchase.</p></Card>
        </div>
      </section>
    </main>
  );
}
