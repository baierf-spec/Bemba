"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CircleHelp,
  Eye,
  MessageCircle,
  Package,
  Plus,
  Search,
  Sparkles,
  Store,
  Upload,
  Users,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { demoProducts, categories, type DemoProduct } from "@/lib/demo/catalog";
import {
  Photo,
  PhonePreview,
  ProductCard,
  SectionTitle,
  GrowthCard,
  StoreBadge,
  StoreBanner,
  PlanCards,
  categoryIcons,
} from "./shared";
import { WorkspaceHead } from "./seller-shell";
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Stats() {
  return (
    <div className="stats-grid">
      {[
        {
          Icon: Package,
          value: String(demoProducts.length),
          label: "Sample products",
          note: "Design preview catalog",
        },
        {
          Icon: MessageCircle,
          value: "—",
          label: "WhatsApp clicks",
          note: "No live events connected",
        },
        {
          Icon: Eye,
          value: "—",
          label: "Store views",
          note: "No live events connected",
        },
        {
          Icon: Users,
          value: "—",
          label: "Visitors",
          note: "No live events connected",
        },
      ].map((s) => (
        <div className="stat-card" key={s.label}>
          <s.Icon />
          <div>
            <strong>{s.value}</strong>
            <p>{s.label}</p>
            <small>{s.note}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
export function ProductsTable({
  products = demoProducts,
  compact = false,
}: {
  products?: DemoProduct[];
  compact?: boolean;
}) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            {!compact && <th>Category</th>}
            <th>Price</th>
            <th>Stock*</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <Link className="table-product" href={`/demo/products/${p.id}`}>
                  <Photo src={p.image} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <small>{p.id.toUpperCase().slice(0, 12)}</small>
                  </div>
                </Link>
              </td>
              {!compact && <td>{p.category}</td>}
              <td>K{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <span className="pill">Sample</span>
              </td>
              <td>
                <Link href={`/demo/dashboard/products/${p.id}/edit`}>
                  Edit ↗
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Tips() {
  return (
    <div className="panel">
      <h3>Little details. A big difference.</h3>
      <ul className="tip-list">
        {[
          "Use clear, bright product photos",
          "Write helpful product descriptions",
          "Keep your availability up to date",
          "Share your storefront link",
          "Make it easy to contact you",
        ].map((t) => (
          <li key={t}>
            <Check />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
function AiBox() {
  const [facts, setFacts] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  return (
    <div className="panel ai-panel">
      <p className="eyebrow">AI TOOLS · DESIGN PREVIEW</p>
      <h2>
        Create amazing content with AI <Sparkles size={20} />
      </h2>
      <p>A little inspiration. More time for your business.</p>
      <Field label="Tell us about your product">
        <textarea
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
          placeholder="What makes your product special? Add materials, size and features…"
        />
      </Field>
      <div className="form-grid">
        <Field label="Tone">
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option>Friendly</option>
            <option>Professional</option>
            <option>Playful</option>
          </select>
        </Field>
        <Field label="Length">
          <select>
            <option>Short & sweet</option>
            <option>Detailed</option>
          </select>
        </Field>
      </div>
      <div className="form-actions">
        <button
          className="btn"
          onClick={() =>
            setResult(
              `${tone} example template: Meet your next everyday favourite. ${facts.trim() || "Add your product details to make this description your own."} Contact us to ask about availability.`,
            )
          }
        >
          <Sparkles size={14} /> Preview sample output
        </button>
      </div>
      {result && (
        <div className="panel mt-4">
          <h3>Example template — not AI generated</h3>
          <p role="status">{result}</p>
          <button
            className="text-link mt-3"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(result);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Copy size={13} />
            {copied ? "Copied" : "Copy sample"}
          </button>
        </div>
      )}
      <p className="mt-3">
        Preview only. No AI API is called and no usage is charged.
      </p>
    </div>
  );
}
export function SellerOverview() {
  return (
    <>
      <WorkspaceHead
        eyebrow="GOOD TO SEE YOU AGAIN"
        title="Welcome back, Chisomo Fashion 👋"
        subtitle="Here’s a little inspiration for your business today."
      />
      <Stats />
      <div className="workspace-grid">
        <div>
          <AiBox />
          <div className="panel">
            <div className="panel-header">
              <h2>Recent products</h2>
              <Link className="text-link" href="/demo/dashboard/products">
                View all products →
              </Link>
            </div>
            <ProductsTable products={demoProducts.slice(0, 5)} compact />
          </div>
          <div className="panel">
            <div className="panel-header">
              <h2>Store performance</h2>
              <Link href="/demo/dashboard/analytics" className="text-link">
                View analytics →
              </Link>
            </div>
            <div className="chart-empty">
              <BarChart3 size={33} />
              <span>Your story is just getting started.</span>
              <small>
                Real store views will appear once event collection is connected.
              </small>
            </div>
          </div>
        </div>
        <aside>
          <div className="preview-panel">
            <div className="preview-label">
              <span className="status-dot" />
              Your store preview
            </div>
            <PhonePreview />
            <Link href="/demo/store" className="text-link">
              Visit example store <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="panel mt-4">
            <h3>Quick actions</h3>
            <ul className="tip-list">
              <li>
                <Plus />
                <Link href="/demo/dashboard/products/new">Add a product</Link>
              </li>
              <li>
                <Store />
                <Link href="/demo/dashboard/storefront">
                  Customize storefront
                </Link>
              </li>
              <li>
                <Sparkles />
                <Link href="/demo/dashboard/ai">Explore AI tools</Link>
              </li>
            </ul>
          </div>
          <GrowthCard />
        </aside>
      </div>
    </>
  );
}
export function ManageProducts() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const products = demoProducts.filter(
    (p) =>
      (category === "All products" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <WorkspaceHead
        eyebrow="PRODUCTS"
        title="Manage your products"
        subtitle="Add, edit and organise your products. Keep your store fresh and reach more customers."
        action={
          <Link href="/demo/dashboard/products/new" className="btn">
            <Plus size={15} /> Add new product
          </Link>
        }
      />
      <Stats />
      <nav className="category-strip" aria-label="Filter sample products">
        {categories.slice(0, 7).map((c, i) => {
          const Icon = categoryIcons[i];
          return (
            <button
              key={c}
              className={c === category ? "selected" : ""}
              onClick={() => setCategory(c)}
            >
              <Icon />
              {c}
            </button>
          );
        })}
      </nav>
      <div className="workspace-grid">
        <div>
          <div className="table-search">
            <div className="search-box">
              <Search size={15} />
              <input
                placeholder="Search products by name…"
                aria-label="Search seller products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="panel p-0">
            <ProductsTable products={products} />
            {!products.length && (
              <p className="p-5">No matching sample products.</p>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Showing {products.length} sample products. *Stock quantities are
            examples.
          </p>
        </div>
        <aside>
          <GrowthCard />
          <div className="mt-4">
            <Tips />
          </div>
        </aside>
      </div>
    </>
  );
}
export function ProductEditor({ product }: { product?: DemoProduct }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 450);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(product?.image || "/images/handbag.webp");
  const [category, setCategory] = useState(product?.category || "Fashion");
  const [notice, setNotice] = useState("");
  function photo(file?: File) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setNotice("Choose a JPEG, PNG or WebP smaller than 5 MB.");
      return;
    }
    setImage(URL.createObjectURL(file));
    setNotice("Image preview updated. This file has not been uploaded.");
  }
  const preview = {
    ...demoProducts[0],
    name: name || "Your product name",
    price,
    image,
    category,
  };
  return (
    <>
      <WorkspaceHead
        eyebrow="PRODUCTS / PRODUCT EDITOR"
        title={product ? "Edit your product" : "Add a new product"}
        subtitle="Let your products reach more customers across Zambia and beyond."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNotice(
            "Preview updated. This demo does not publish or save products to your account.",
          );
        }}
      >
        <div className="workspace-grid">
          <div>
            <div className="panel">
              <h2>1. Basic information</h2>
              <Field label="Product name *">
                <input
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chitenge handbag"
                />
              </Field>
              <Field label="Category *">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.slice(1).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <div className="form-grid">
                <Field label="Price (ZMW) *">
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </Field>
                <Field label="Stock quantity (sample)">
                  <input
                    type="number"
                    min={0}
                    defaultValue={product?.stock || 1}
                  />
                </Field>
              </div>
            </div>
            <div className="panel">
              <h2>2. Product description</h2>
              <p>
                Tell your product’s story. Materials, details and all the little
                things that matter.
              </p>
              <Field label="Description">
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What makes your product special?"
                />
              </Field>
            </div>
            <div className="panel">
              <h2>3. Product photos</h2>
              <p>
                Clear photos help customers see every detail. Preview one image
                below.
              </p>
              <div className="photo-upload-grid">
                <Photo src={image} alt="Product image preview" />
                <Photo
                  src="/images/seller-hero.webp"
                  alt="Illustrative lifestyle photo"
                />
                <label className="upload-box">
                  <Upload />
                  <strong>Add photo</strong>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => photo(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
            <div className="panel">
              <h2>4. Visibility</h2>
              <label className="toggle-row">
                <span>
                  Show on Bemba marketplace
                  <small>
                    Preview preference only. Publishing requires moderation.
                  </small>
                </span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
            <div className="panel">
              <h2>5. Delivery & pickup</h2>
              <label className="toggle-row">
                <span>Pickup available</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="toggle-row">
                <span>
                  Local delivery
                  <small>
                    Arrange details and pricing directly with your customer.
                  </small>
                </span>
                <input type="checkbox" />
              </label>
            </div>
            <div className="panel">
              <h2>6. Tags</h2>
              <Field label="Help customers discover your product">
                <input placeholder="handmade, fashion, Zambia" />
              </Field>
            </div>
          </div>
          <aside>
            <div className="panel ai-panel">
              <h3>
                <Sparkles size={16} className="inline mr-1" /> AI Product
                Assistant
              </h3>
              <p>
                Explore how product details can become a helpful description.
              </p>
              <Link href="/demo/dashboard/ai" className="btn btn-small mt-4">
                Explore AI preview →
              </Link>
            </div>
            <div className="panel preview-product">
              <h3>Product preview</h3>
              <p className="mb-3">Your changes appear here.</p>
              <ProductCard product={preview} />
            </div>
            <Tips />
          </aside>
        </div>
        {notice && (
          <p role="status" className="inline-notice">
            {notice}
          </p>
        )}
        <div className="form-actions">
          <Link href="/demo/dashboard/products" className="text-link">
            ← Back to products
          </Link>
          <button
            className="btn btn-white"
            type="button"
            onClick={() =>
              setNotice("This is a design preview. Drafts are not saved.")
            }
          >
            Preview draft
          </button>
          <button className="btn" type="submit">
            Preview product <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </>
  );
}
export function AiTools() {
  return (
    <>
      <WorkspaceHead
        eyebrow="AI TOOLS"
        title="Create amazing content with AI ✨"
        subtitle="Save time. Tell your story. Grow your business."
      />
      <Stats />
      <div className="workspace-grid">
        <div>
          <AiBox />
          <div className="mini-panels">
            <div className="panel">
              <h3>Start with the details</h3>
              <p>
                Tell customers about materials, dimensions, care and what makes
                your product special.
              </p>
            </div>
            <div className="panel">
              <h3>Make it sound like you</h3>
              <p>
                Read every draft, add your own voice and confirm that every
                product claim is accurate.
              </p>
            </div>
          </div>
        </div>
        <aside>
          <div className="panel preview-product">
            <h3>Product preview</h3>
            <ProductCard product={demoProducts[0]} />
          </div>
          <GrowthCard />
        </aside>
      </div>
    </>
  );
}
export function Analytics() {
  const [period, setPeriod] = useState("Last 30 days");
  return (
    <>
      <WorkspaceHead
        title="Analytics"
        subtitle="Understand your audience. Grow your business. A brighter tomorrow."
      />
      <div className="table-search justify-end">
        <select
          aria-label="Analytics period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <Stats />
      <div className="workspace-grid">
        <div>
          <div className="panel">
            <div className="panel-header">
              <h2>Store views over time</h2>
              <span className="text-[10px] text-muted-foreground">
                {period}
              </span>
            </div>
            <div className="chart-empty">
              <BarChart3 size={35} />
              <strong>No recorded events</strong>
              <small>
                There are no connected analytics events in this preview.
              </small>
            </div>
          </div>
          <div className="mini-panels">
            <div className="panel">
              <h2>From discovery to inquiry</h2>
              {["Store views", "Product views", "WhatsApp clicks"].map((t) => (
                <div className="toggle-row" key={t}>
                  <span>{t}</span>
                  <strong>—</strong>
                </div>
              ))}
            </div>
            <div className="panel">
              <h2>Top products by views</h2>
              <div className="chart-empty">
                <Eye size={25} />
                <span>Awaiting real product views</span>
              </div>
            </div>
          </div>
          <div className="mini-panels">
            <div className="panel">
              <h3>Traffic sources</h3>
              <p>Sources will appear as people discover your storefront.</p>
            </div>
            <div className="panel">
              <h3>Customer locations</h3>
              <p>No location data has been collected.</p>
            </div>
          </div>
        </div>
        <aside>
          <GrowthCard />
          <div className="panel mt-4">
            <h3>Make every visit count</h3>
            <p>
              Keep product information clear, make your photos shine, and share
              your store with your community.
            </p>
          </div>
        </aside>
      </div>
      <div className="metric-explanation">
        <CircleHelp size={18} />
        <p>
          WhatsApp clicks measure contact-button interactions. They do not
          represent messages sent, completed orders or sales revenue.
        </p>
      </div>
    </>
  );
}
export function Inquiries() {
  return (
    <>
      <WorkspaceHead
        eyebrow="WHATSAPP ACTIVITY"
        title="Stay connected with your customers."
        subtitle="Customers reach you directly on WhatsApp. Keep the conversation personal."
      />
      <Stats />
      <div className="workspace-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Contact activity</h2>
            <span className="pill">No live events</span>
          </div>
          <div className="empty-state">
            <MessageCircle size={38} />
            <h2>Great conversations start here.</h2>
            <p>
              When customers click your published storefront’s WhatsApp button,
              those clicks can appear in your analytics. Their messages stay in
              WhatsApp.
            </p>
            <Link className="btn btn-small" href="/demo/store">
              Preview your store <ArrowRight size={13} />
            </Link>
          </div>
          <div className="metric-explanation">
            <ShieldCheck size={18} />
            <p>
              Bemba does not read WhatsApp conversations or create internal
              orders. No contact events have been collected in this preview.
            </p>
          </div>
        </div>
        <aside>
          <GrowthCard />
          <Tips />
        </aside>
      </div>
    </>
  );
}
export function Billing() {
  return (
    <>
      <WorkspaceHead
        title="Billing & Plans"
        subtitle="Choose the right plan for a bigger tomorrow."
      />
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Your next chapter starts here.</h2>
            <p>Choose the tools that fit your business as it grows.</p>
          </div>
          <Store className="text-primary" size={30} />
        </div>
        <p>
          Plans shown below are an overview of the intended offering. Pricing,
          limits and activation will be announced before paid subscriptions
          become available.
        </p>
      </div>
      <SectionTitle
        title="A little space to grow."
        subtitle="No subscription is activated from this design preview."
      />
      <PlanCards />
      <div className="mini-panels mt-6">
        <div className="panel">
          <h2>Payment methods</h2>
          <p>
            No payment method is connected. Paid plans are not available yet.
          </p>
        </div>
        <div className="panel">
          <h2>Invoices</h2>
          <p>No invoices. Bemba has not collected a subscription payment.</p>
        </div>
      </div>
    </>
  );
}
export function SettingsPreview() {
  const [tab, setTab] = useState("Profile");
  const [name, setName] = useState("Chisomo Banda");
  const [business, setBusiness] = useState("Chisomo Fashion");
  const [notice, setNotice] = useState("");
  return (
    <>
      <WorkspaceHead
        eyebrow="SETTINGS"
        title="Store settings"
        subtitle="Manage your account, preferences and set up your store for success."
      />
      <nav className="tabs" aria-label="Settings tabs">
        {["Profile", "Notifications", "Security", "Preferences"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => {
              setTab(t);
              setNotice("");
            }}
          >
            {t}
          </button>
        ))}
      </nav>
      <div className="workspace-grid">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNotice(
              "Preview updated. These example settings are not saved to a real account.",
            );
          }}
        >
          <div className="panel">
            {tab === "Profile" ? (
              <>
                <h2>Profile information</h2>
                <div className="form-grid">
                  <Field label="Owner’s name">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label="Business name">
                    <input
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Email address">
                  <input type="email" placeholder="your@email.com" />
                </Field>
                <Field label="Location / City">
                  <input defaultValue="Lusaka, Zambia" />
                </Field>
                <Field label="About your business">
                  <textarea defaultValue="Modern African fashion for everyday you. Thoughtfully made, colourful pieces inspired by Zambia." />
                </Field>
              </>
            ) : tab === "Notifications" ? (
              <>
                <h2>Notification preferences</h2>
                {[
                  "Email notifications",
                  "Product moderation updates",
                  "Product tips and announcements",
                ].map((x) => (
                  <label key={x} className="toggle-row">
                    <span>
                      {x}
                      <small>Demo preference</small>
                    </span>
                    <input type="checkbox" defaultChecked />
                  </label>
                ))}
              </>
            ) : tab === "Security" ? (
              <>
                <h2>Keep your account secure.</h2>
                <p>
                  Use your real account settings to change your password and
                  enable administrator multi-factor authentication.
                </p>
                <Link
                  href="/auth/forgot-password"
                  className="btn btn-small mt-5"
                >
                  Reset your password
                </Link>
                <div className="metric-explanation">
                  <ShieldCheck size={20} /> Demo settings cannot change real
                  credentials.
                </div>
              </>
            ) : (
              <>
                <h2>Language & currency</h2>
                <Field label="Language">
                  <select>
                    <option>English</option>
                  </select>
                </Field>
                <Field label="Currency">
                  <select>
                    <option>Zambian Kwacha (ZMW)</option>
                  </select>
                </Field>
                <p>
                  Bemba launches in Zambia. More preferences will be added as
                  the product grows.
                </p>
              </>
            )}
            {tab !== "Security" && (
              <div className="form-actions">
                <button className="btn">Preview changes</button>
              </div>
            )}
          </div>
          {notice && (
            <p className="inline-notice" role="status">
              {notice}
            </p>
          )}
          <div className="panel">
            <h2>Your real account</h2>
            <p>The preview does not expose or modify your private profile.</p>
            <Link className="text-link mt-4" href="/dashboard/settings">
              Open protected account settings <ArrowUpRight size={13} />
            </Link>
          </div>
        </form>
        <aside>
          <div className="panel account-preview">
            <h3>Your account preview</h3>
            <StoreBanner />
            <StoreBadge />
            <h3>{business}</h3>
            <p>{name} · Lusaka, Zambia</p>
            <Link href="/demo/store" className="btn btn-white">
              View your store <ArrowUpRight size={13} />
            </Link>
          </div>
          <Tips />
          <GrowthCard />
        </aside>
      </div>
    </>
  );
}
