"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  Truck,
  Store,
  Clock,
  Leaf,
  Package,
  Mail,
  ChevronRight,
} from "lucide-react";
import { demoProducts, type DemoProduct } from "@/lib/demo/catalog";
import {
  Photo,
  StoreBadge,
  StoreBanner,
  ProductCard,
  SectionTitle,
  Benefits,
} from "./shared";
export function ProductDetail({ product: p }: { product: DemoProduct }) {
  const [selected, setSelected] = useState(p.image);
  const [notice, setNotice] = useState(false);
  const images = [p.image, "/images/seller-hero.webp"];
  return (
    <div className="page-container">
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <ChevronRight size={10} />
        <Link href="/demo/marketplace">Products</Link>
        <ChevronRight size={10} />
        {p.category}
        <ChevronRight size={10} />
        {p.name}
      </div>
      <section className="product-detail-grid">
        <div className="product-gallery">
          <div className="gallery-thumbs">
            {images.map((src, i) => (
              <button
                key={src}
                aria-label={`View ${i === 0 ? "product" : "illustrative boutique"} photo`}
                className={selected === src ? "selected" : ""}
                onClick={() => setSelected(src)}
              >
                <Photo src={src} alt="" />
              </button>
            ))}
          </div>
          <Photo
            className="gallery-main"
            src={selected}
            alt={
              selected === p.image ? p.name : "Illustrative boutique photograph"
            }
            priority
          />
        </div>
        <div className="detail-copy">
          <span className="pill">Sample product</span>
          <h1>{p.name}</h1>
          <div className="detail-price">K{p.price}</div>
          <p>
            {p.category === "Fashion"
              ? "Thoughtfully made, full of character. Bring a little local creativity to your everyday with a piece that feels as special as the story behind it."
              : "Beautiful everyday essentials, thoughtfully selected for your home and lifestyle. Discover something a little different from an independent business."}
          </p>
          <div className="seller-line">
            <StoreBadge small />
            <div>
              <strong>{p.seller}</strong>
              <p>
                <MapPin size={11} />
                {p.city}, Zambia
              </p>
            </div>
            <Link href="/demo/store">Visit seller store →</Link>
          </div>
          <div className="detail-meta">
            <span>
              Availability: <strong>Sample listing</strong>
            </span>
            <span>Ask the seller about options</span>
          </div>
          <button className="btn" onClick={() => setNotice(true)}>
            <MessageCircle size={19} /> Inquire on WhatsApp{" "}
            <ArrowRight size={15} />
          </button>
          <small>
            Contact the seller directly to discuss availability and delivery.
          </small>
          {notice && (
            <p className="inline-notice" role="status">
              This is a sample listing. WhatsApp contact is available only for
              published stores with a real seller phone number.
            </p>
          )}
        </div>
      </section>
      <section className="section-space">
        <Benefits />
      </section>
      <section className="product-info-grid">
        <div>
          <h2>Product description</h2>
          <p>
            This sample {p.name.toLowerCase()} shows how your products will
            appear on Bemba. Add the details your customers care about:
            materials, size, care instructions and what makes your product
            special.
          </p>
          <ul>
            <li>A clear description that tells your product’s story</li>
            <li>Beautiful photography from every angle</li>
            <li>Direct contact with the business behind the product</li>
          </ul>
        </div>
        <div className="delivery-card">
          <h2>
            <Truck size={22} /> Delivery & pickup
          </h2>
          <p>
            <MapPin size={17} /> Based in {p.city}, Zambia
          </p>
          <p>
            <Store size={17} /> Pickup arrangements directly with the seller
          </p>
          <p>
            <Package size={17} /> Ask about delivery options and costs
          </p>
          <p>
            <MessageCircle size={17} /> Confirm all details on WhatsApp
          </p>
        </div>
      </section>
      <section className="section-space">
        <SectionTitle
          title="More to discover"
          subtitle="A few more finds from our sample collection."
          href="/demo/marketplace"
        />
        <div className="products-grid">
          {demoProducts
            .filter((x) => x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard product={x} key={x.id} />
            ))}
        </div>
      </section>
    </div>
  );
}
export function Storefront() {
  const [tab, setTab] = useState("Products");
  const [sort, setSort] = useState("featured");
  const [notice, setNotice] = useState(false);
  const products =
    sort === "low"
      ? [...demoProducts].sort((a, b) => a.price - b.price)
      : demoProducts;
  return (
    <div className="page-container store-public">
      <StoreBanner />
      <div className="store-identity">
        <StoreBadge />
        <div>
          <h1>Chisomo Fashion</h1>
          <p className="location">
            <MapPin size={11} />
            Fashion · Lusaka, Zambia <span className="pill">Example store</span>
          </p>
          <p>
            Modern African fashion for everyday you. Colourful pieces,
            thoughtful details and a little local joy. This is an illustrative
            storefront.
          </p>
        </div>
        <button className="btn btn-white" onClick={() => setNotice(true)}>
          <MessageCircle size={17} /> Chat on WhatsApp
        </button>
      </div>
      {notice && (
        <p className="inline-notice" role="status">
          This example store has no real contact number. No message has been
          sent.
        </p>
      )}
      <nav className="tabs store-tabs" aria-label="Store sections">
        {["Products", "About", "Contact"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      {tab === "Products" ? (
        <section>
          <div className="market-toolbar">
            <div>
              <h2>Products from Chisomo Fashion</h2>
              <p>
                Beautiful finds for everyday you. Illustrative sample
                collection.
              </p>
            </div>
            <select
              aria-label="Store product sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to high</option>
            </select>
          </div>
          <div className="products-grid">
            {products.slice(0, 10).map((p) => (
              <ProductCard
                key={p.id}
                product={{ ...p, seller: "Chisomo Fashion" }}
              />
            ))}
          </div>
        </section>
      ) : tab === "About" ? (
        <section className="panel">
          <h2>A little colour. A lot of heart.</h2>
          <p>
            Chisomo Fashion is an example of how an independent business can
            tell its story on Bemba. Sellers can introduce their craft, share
            the inspiration behind their products, and help customers get to
            know the people behind the store.
          </p>
        </section>
      ) : (
        <section className="panel">
          <h2>Let’s start a conversation.</h2>
          <p>
            Real stores display the seller’s saved contact details here. This
            design preview does not publish a fictional phone number or email
            address.
          </p>
        </section>
      )}
      <div className="store-contact-grid">
        <div>
          <h3>
            <Clock size={18} /> Opening hours
          </h3>
          <p>Example hours</p>
          <p>
            Monday – Friday <span className="float-right">09:00 – 18:00</span>
          </p>
          <p>
            Saturday <span className="float-right">09:00 – 14:00</span>
          </p>
          <p>
            Sunday <span className="float-right">Closed</span>
          </p>
        </div>
        <div>
          <h3>
            <Mail size={18} /> Contact details
          </h3>
          <p>Lusaka, Zambia · Example location</p>
          <p>Phone and email will appear for real stores.</p>
          <p>Contact the seller directly on WhatsApp.</p>
        </div>
        <div>
          <h3>
            <Truck size={18} /> Delivery & pickup
          </h3>
          <p>Arrange pickup directly with the seller.</p>
          <p>Ask about local and nationwide delivery.</p>
          <p>Confirm availability before travelling.</p>
        </div>
      </div>
      <div className="market-promo">
        <div>
          <h2>Your business belongs here.</h2>
          <p>Create a beautiful storefront and share it with the world.</p>
          <Link href="/auth/register" className="btn btn-small">
            Start your own store <ArrowRight size={12} />
          </Link>
        </div>
        <Leaf size={65} className="mr-8 text-primary opacity-50" />
      </div>
    </div>
  );
}
