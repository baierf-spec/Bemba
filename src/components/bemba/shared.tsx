import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Leaf,
  MapPin,
  MessageCircle,
  Sprout,
  Store,
  Sparkles,
  Headphones,
  Shirt,
  Armchair,
  Apple,
  HeartPulse,
  Dumbbell,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import type { DemoProduct } from "@/lib/demo/catalog";

export function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 25vw"
        priority={priority}
      />
    </div>
  );
}
export function SectionTitle({
  title,
  subtitle,
  href,
  link = "View all products",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function ProductCard({ product: p }: { product: DemoProduct }) {
  return (
    <Link className="product-card" href={`/demo/products/${p.id}`}>
      <Photo src={p.image} alt={p.name} />
      <div className="product-copy">
        <h3>{p.name}</h3>
        <strong>K{p.price.toLocaleString()}</strong>
        <p>{p.seller}</p>
        <span>
          <MapPin size={12} />
          {p.city}
        </span>
      </div>
    </Link>
  );
}
export const categoryIcons = [
  LayoutGrid,
  Shirt,
  Sparkles,
  Headphones,
  Armchair,
  Apple,
  HeartPulse,
  Dumbbell,
  Store,
];
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Bemba home"
    >
      <Sprout size={26} strokeWidth={2.5} />
      Bemba
    </Link>
  );
}
export function DemoNotice() {
  return (
    <div className="demo-notice">
      <span>
        <span className="status-dot" /> Design preview · Sample products and
        store details. Changes are not saved.
      </span>
      <Link href="/demo/dashboard">
        Explore seller hub <ArrowRight size={13} />
      </Link>
    </div>
  );
}
export function StoreBadge({ small = false }: { small?: boolean }) {
  return (
    <div className={`store-badge ${small ? "small" : ""}`}>
      <Sprout size={small ? 22 : 32} />
      <span>CHISOMO</span>
      {!small && <small>FASHION</small>}
    </div>
  );
}
export function GrowthCard() {
  return (
    <div className="growth-card">
      <div>
        <p className="eyebrow">ROOTED IN LOCAL</p>
        <h3>
          Small business.
          <br />
          Big possibilities.
        </h3>
        <Link href="/demo/store" className="text-link">
          View your storefront <ArrowRight size={14} />
        </Link>
      </div>
      <Photo src="/images/plant.webp" alt="Green indoor plant" />
    </div>
  );
}
export function StoreBanner() {
  return (
    <div className="store-banner">
      <div>
        <p className="eyebrow">MADE WITH HEART</p>
        <h2>
          Fashion
          <br />
          that celebrates
          <br />
          <em>Zambia.</em>
        </h2>
        <p>Local style. Brighter tomorrows.</p>
      </div>
      <Photo
        src="/images/seller-hero.webp"
        alt="Illustrative Zambian fashion artisan in her boutique"
      />
      <span className="handwritten">
        Local people.
        <br />
        Real possibilities. ♡
      </span>
    </div>
  );
}
export function PhonePreview({
  name = "Chisomo Fashion",
  tagline = "Fashion that celebrates Zambia",
  color = "#175540",
}: {
  name?: string;
  tagline?: string;
  color?: string;
}) {
  return (
    <div className="phone">
      <div className="phone-camera" />
      <div className="phone-top">
        <Sprout size={13} /> Bemba <span>☰</span>
      </div>
      <Photo src="/images/seller-hero.webp" alt="Example storefront cover" />
      <div className="phone-content">
        <StoreBadge small />
        <h4>{name}</h4>
        <p>
          <MapPin size={10} /> Lusaka, Zambia
        </p>
        <p>{tagline}</p>
        <div className="phone-cta" style={{ background: color }}>
          <MessageCircle size={11} /> Contact on WhatsApp
        </div>
        <div className="phone-tabs">
          Products <span>About</span> Contact
        </div>
        <div className="phone-products">
          <Photo src="/images/handbag.webp" alt="Sample handbag" />
          <Photo src="/images/sneakers.webp" alt="Sample shoes" />
          <Photo src="/images/skincare.webp" alt="Sample cosmetics" />
        </div>
        <div className="phone-labels">
          <span>
            Kitenge bag
            <br />
            <b>K450</b>
          </span>
          <span>
            Sneakers
            <br />
            <b>K620</b>
          </span>
          <span>
            Body butter
            <br />
            <b>K280</b>
          </span>
        </div>
      </div>
    </div>
  );
}
export function PlanCards() {
  return (
    <div className="plan-grid">
      {[
        {
          name: "Free",
          desc: "A place to get started",
          features: [
            "Your own branded storefront",
            "Product catalog",
            "Direct WhatsApp inquiries",
            "Basic storefront customization",
          ],
        },
        {
          name: "Business",
          desc: "Room for your business to grow",
          features: [
            "A larger product catalog",
            "AI product descriptions",
            "Storefront customization",
            "Discovery and click analytics",
          ],
        },
        {
          name: "Pro",
          desc: "For your next chapter",
          features: [
            "An expanded product catalog",
            "Advanced customization",
            "More AI usage",
            "Priority support",
          ],
        },
      ].map((p, i) => (
        <div key={p.name} className={`plan-card ${i === 1 ? "highlight" : ""}`}>
          <div className="plan-name">
            <h3>{p.name}</h3>
            {i === 1 && <span>For growing businesses</span>}
          </div>
          <p>{p.desc}</p>
          <div className="plan-price">
            {i === 0 ? "Start simple" : "Grow further"}
          </div>
          <small>Pricing & limits to be announced</small>
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <Check size={14} />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/register"
            className={`btn ${i === 1 ? "" : "btn-light"}`}
          >
            Create your account <ChevronRight size={15} />
          </Link>
        </div>
      ))}
    </div>
  );
}
export function Benefits() {
  return (
    <div className="benefit-grid">
      {[
        [
          Store,
          "Beautiful storefronts",
          "A professional home for your products, on every device.",
        ],
        [
          MessageCircle,
          "Direct WhatsApp inquiries",
          "Talk directly with customers, in a place you already know.",
        ],
        [
          Sparkles,
          "AI product descriptions",
          "Turn product details into clear, compelling descriptions.",
        ],
        [
          Leaf,
          "Made for local business",
          "Simple tools. More time for the work you love.",
        ],
      ].map(([Icon, title, copy]) => {
        const I = Icon as typeof Store;
        return (
          <div className="benefit" key={String(title)}>
            <I size={28} />
            <div>
              <h3>{String(title)}</h3>
              <p>{String(copy)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
