import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoNotice } from "@/components/bemba/shared";
import { Marketplace } from "@/components/bemba/marketplace";
import { ProductDetail, Storefront } from "@/components/bemba/product-store";
import { SellerShell } from "@/components/bemba/seller-shell";
import {
  SellerOverview,
  ManageProducts,
  ProductEditor,
  AiTools,
  Analytics,
  Inquiries,
  Billing,
  SettingsPreview,
} from "@/components/bemba/seller-pages";
import { StoreEditor } from "@/components/bemba/store-editor";
import { demoProducts } from "@/lib/demo/catalog";
export const metadata: Metadata = {
  title: "Design preview",
  robots: { index: false, follow: false },
};
export default async function Demo({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { slug = [] } = await params;
  const q = await searchParams;
  const path = slug.join("/");
  let screen: React.ReactNode;
  let seller = false;
  if (!path || path === "marketplace")
    screen = <Marketplace initialQuery={q.q} initialCategory={q.category} />;
  else if (path === "store") screen = <Storefront />;
  else if (slug[0] === "products" && slug.length === 2) {
    const product = demoProducts.find((p) => p.id === slug[1]);
    if (!product) notFound();
    screen = <ProductDetail product={product} />;
  } else {
    seller = true;
    if (path === "dashboard") screen = <SellerOverview />;
    else if (path === "dashboard/products") screen = <ManageProducts />;
    else if (path === "dashboard/products/new") screen = <ProductEditor />;
    else if (
      slug[0] === "dashboard" &&
      slug[1] === "products" &&
      slug[3] === "edit" &&
      slug.length === 4
    ) {
      const product = demoProducts.find((p) => p.id === slug[2]);
      if (!product) notFound();
      screen = <ProductEditor product={product} />;
    } else if (path === "dashboard/storefront")
      screen = <StoreEditor customize />;
    else if (path === "dashboard/ai") screen = <AiTools />;
    else if (path === "dashboard/analytics") screen = <Analytics />;
    else if (path === "dashboard/inquiries") screen = <Inquiries />;
    else if (path === "dashboard/billing") screen = <Billing />;
    else if (path === "dashboard/settings") screen = <SettingsPreview />;
    else if (
      slug[0] === "onboarding" &&
      slug.length === 2 &&
      ["1", "2", "3", "4"].includes(slug[1])
    )
      screen = <StoreEditor initialStep={Number(slug[1])} />;
    else notFound();
  }
  return (
    <main id="main">
      <DemoNotice />
      {seller ? <SellerShell>{screen}</SellerShell> : screen}
    </main>
  );
}
