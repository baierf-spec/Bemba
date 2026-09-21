import type { Metadata } from "next";
import { PlanCards, Benefits } from "@/components/bemba/shared";
export const metadata: Metadata = {
  title: "Seller plans",
  alternates: { canonical: "/pricing" },
};
export default function Pricing() {
  return (
    <main id="main" className="page-container pricing-page">
      <div className="center-heading">
        <p className="eyebrow">SMALL BUSINESS. BIG POSSIBILITIES.</p>
        <h1>A plan for your next chapter.</h1>
        <p>
          Build your storefront. Share what you make. Grow at your own pace.
        </p>
      </div>
      <PlanCards />
      <p className="pricing-note">
        Paid subscriptions and promotions are not available yet. Final prices
        and limits will be published before launch.
      </p>
      <Benefits />
      <section className="faq">
        <h2>A few things worth knowing.</h2>
        {[
          [
            "Does Bemba process product payments?",
            "No. Customers contact you through WhatsApp. You arrange payment, pickup and delivery directly with them.",
          ],
          [
            "Can I explore the platform first?",
            "Yes. Our design preview lets you explore sample products, storefronts and the seller workspace. Preview changes are not saved.",
          ],
          [
            "When will paid plans be available?",
            "We will publish the confirmed prices and feature limits before enabling subscriptions. No payment is collected from these pages.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
