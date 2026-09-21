import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Store,
  Package,
  Share2,
  MessageCircle,
  Leaf,
} from "lucide-react";
import {
  Photo,
  PhonePreview,
  SectionTitle,
  ProductCard,
  Benefits,
  PlanCards,
} from "@/components/bemba/shared";
import { demoProducts } from "@/lib/demo/catalog";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <main id="main">
      <section className="home-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">AFRICAN BUSINESSES. BRIGHTER TOMORROWS.</p>
            <h1>
              Your business.
              <br />
              Your store.
              <br />
              <em>More customers.</em>
            </h1>
            <p className="hero-description">
              Bemba helps local sellers in Zambia create beautiful online
              stores, and lets buyers discover amazing products from real
              people.
            </p>
            <form className="search-box" action="/demo/marketplace">
              <Search size={20} />
              <input
                aria-label="Search products, sellers or categories"
                name="q"
                placeholder="Search for products, sellers or categories…"
              />
              <button className="btn btn-small">Search</button>
            </form>
            <div className="hero-buttons">
              <Link href="/demo/onboarding/1" className="btn">
                Start selling <ArrowRight size={16} />
              </Link>
              <Link href="/demo/marketplace" className="btn btn-white">
                Explore products
              </Link>
            </div>
            <div className="hero-checks">
              <span>
                <CheckCircle2 />
                Quick setup
              </span>
              <span>
                <CheckCircle2 />
                WhatsApp inquiries
              </span>
              <span>
                <CheckCircle2 />
                No technical skills needed
              </span>
            </div>
          </div>
          <div className="hero-art">
            <Photo
              className="hero-plant"
              src="/images/plant.webp"
              alt="Lush green plant"
            />
            <span className="hero-note handwritten">
              Real people.
              <br />
              Real businesses.
              <br />A brighter Africa.<span>↘</span>
            </span>
            <div className="hero-phone">
              <PhonePreview
                name="Kaleza Collections"
                tagline="Quality fashion for everyday you"
              />
            </div>
            <div className="portrait-polaroid">
              <Photo
                src="/images/seller-hero.webp"
                alt="Illustrative artisan celebrating Zambian fashion"
                priority
              />
              <p className="handwritten">Made with heart.</p>
            </div>
            <div className="plant-polaroid">
              <Photo src="/images/plant.webp" alt="Beautiful houseplants" />
              <p>
                Beautiful homes.
                <br />
                Happier people. ♡
              </p>
            </div>
            <span className="hero-sticky handwritten">
              Small businesses.
              <br />
              Big possibilities. 💛
            </span>
            <div className="whatsapp-float">
              <MessageCircle />
              <div>
                <strong>Let’s talk!</strong>
                <small>Connect on WhatsApp</small>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="page-container">
        <section className="home-categories" aria-label="Shop by category">
          {[
            {
              name: "Fashion",
              copy: "Style for every you",
              image: "/images/handbag.webp",
            },
            {
              name: "Beauty",
              copy: "Look good, feel good",
              image: "/images/skincare.webp",
            },
            {
              name: "Electronics",
              copy: "Tech for a better tomorrow",
              image: "/images/headphones.webp",
            },
            {
              name: "Home",
              copy: "Make it yours",
              image: "/images/plant.webp",
            },
            {
              name: "Food",
              copy: "Local flavours, bigger tables",
              image: "/images/coffee.webp",
            },
          ].map((c) => (
            <Link href={`/demo/marketplace?category=${c.name}`} key={c.name}>
              <Photo src={c.image} alt="" />
              <h3>{c.name}</h3>
              <p>{c.copy}</p>
            </Link>
          ))}
        </section>
        <section className="section-space">
          <SectionTitle
            title="Featured products"
            subtitle="A little inspiration from our sample marketplace. Demo products, not live listings."
            href="/demo/marketplace"
          />
          <div className="products-grid home-products">
            {demoProducts.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
      <section className="seller-steps" id="for-sellers">
        <div className="page-container steps-inner">
          <div>
            <p className="eyebrow">FOR SELLERS</p>
            <h2>
              Get your store
              <br />
              up and running
              <br />
              in 3 simple steps.
            </h2>
          </div>
          {[
            {
              Icon: Store,
              title: "Create your store",
              copy: "Sign up and set up your beautiful storefront in minutes.",
            },
            {
              Icon: Package,
              title: "Add your products",
              copy: "Upload photos, set prices, and bring your products to life.",
            },
            {
              Icon: Share2,
              title: "Start a conversation",
              copy: "Share your store and receive customer inquiries on WhatsApp.",
            },
          ].map((s, i) => (
            <div className="seller-step" key={s.title}>
              <span className="step-number">{i + 1}</span>
              <s.Icon size={28} />
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
              {i < 2 && <ArrowRight className="step-arrow" size={20} />}
            </div>
          ))}
        </div>
      </section>
      <div className="page-container">
        <section className="section-space" id="about">
          <SectionTitle
            title="Why sellers love the possibilities"
            subtitle="Everything you need to give your business a place to grow."
            href="/demo/dashboard"
            link="Explore the seller hub"
          />
          <Benefits />
        </section>
        <section className="local-story">
          <Photo
            src="/images/seller-hero.webp"
            alt="Illustrative local fashion boutique"
          />
          <div>
            <p className="eyebrow">
              <Leaf size={15} /> LOCAL TALENT. BIGGER TOMORROWS.
            </p>
            <h2>
              Behind every product,
              <br />
              there’s a person.
            </h2>
            <p>
              The makers. The dreamers. The everyday entrepreneurs. Discover a
              little of what makes Zambia special, and connect directly with the
              people who make it happen.
            </p>
            <Link href="/demo/store" className="text-link">
              Explore an example storefront <ArrowRight size={15} />
            </Link>
          </div>
          <span className="handwritten">
            Good things
            <br />
            grow together. ♡
          </span>
        </section>
        <section className="section-space">
          <SectionTitle
            title="Simple plans. Room to grow."
            subtitle="Start your next chapter. Paid plans are not available yet."
          />
          <PlanCards />
        </section>
      </div>
    </main>
  );
}
