"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Package,
  Store,
  Sparkles,
  ChartNoAxesCombined,
  Settings,
  CreditCard,
  Sprout,
  CircleHelp,
  MessageCircle,
  Plus,
} from "lucide-react";
import { Photo } from "./shared";
export function SellerShell({
  children,
  demo = true,
}: {
  children: React.ReactNode;
  demo?: boolean;
}) {
  const path = usePathname();
  const links = [
    {
      name: "Overview",
      path: demo ? "/demo/dashboard" : "/dashboard",
      Icon: House,
    },
    { name: "Create your store", path: "/demo/onboarding/1", Icon: Plus },
    { name: "Products", path: "/demo/dashboard/products", Icon: Package },
    { name: "Storefront", path: "/demo/dashboard/storefront", Icon: Store },
    { name: "AI Tools", path: "/demo/dashboard/ai", Icon: Sparkles },
    {
      name: "Analytics",
      path: "/demo/dashboard/analytics",
      Icon: ChartNoAxesCombined,
    },
    {
      name: "WhatsApp activity",
      path: "/demo/dashboard/inquiries",
      Icon: MessageCircle,
    },
    {
      name: "Billing & Plans",
      path: "/demo/dashboard/billing",
      Icon: CreditCard,
    },
    {
      name: "Settings",
      path: demo ? "/demo/dashboard/settings" : "/dashboard/settings",
      Icon: Settings,
    },
  ];
  return (
    <div className="seller-layout">
      <aside className="seller-sidebar">
        <p>Seller Hub</p>
        <nav aria-label="Seller navigation">
          {links.map(({ name, path: href, Icon }) => (
            <Link
              href={href}
              key={name}
              className={
                path === href ||
                (name === "Create your store" &&
                  path.startsWith("/demo/onboarding"))
                  ? "active"
                  : ""
              }
            >
              <Icon />
              {name}
            </Link>
          ))}
        </nav>
        <div className="sidebar-growth">
          <Sprout size={31} />
          <h3>
            Grow your business
            <br />
            with Bemba.
          </h3>
          <p>More possibilities. A bigger tomorrow.</p>
          <Link href="/pricing" className="btn">
            Explore seller plans →
          </Link>
        </div>
        <Link href="/pricing" className="sidebar-help">
          <CircleHelp size={14} /> Questions? Start here
        </Link>
      </aside>
      <div className="workspace">{children}</div>
    </div>
  );
}
export function WorkspaceHead({
  title,
  subtitle,
  eyebrow,
  action,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="workspace-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action || (
        <div className="head-decoration">
          <span className="handwritten">
            Local people.
            <br />
            Real possibilities.
            <br />A brighter Africa.
          </span>
          <Photo src="/images/plant.webp" alt="" />
        </div>
      )}
    </div>
  );
}
