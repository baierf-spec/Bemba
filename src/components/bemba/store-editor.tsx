"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  MapPin,
  Store,
} from "lucide-react";
import { WorkspaceHead } from "./seller-shell";
import { Field } from "./seller-pages";
import {
  PhonePreview,
  StoreBadge,
  StoreBanner,
  ProductCard,
  GrowthCard,
  Photo,
} from "./shared";
import { demoProducts } from "@/lib/demo/catalog";
const colors = [
  "#175540",
  "#895630",
  "#e58b36",
  "#bd574e",
  "#35667c",
  "#8474ac",
  "#3b3b3b",
];
export function StoreEditor({
  initialStep = 1,
  customize = false,
}: {
  initialStep?: number;
  customize?: boolean;
}) {
  const [step, setStep] = useState(initialStep);
  const [tab, setTab] = useState("General");
  const [name, setName] = useState("Chisomo Fashion");
  const [tagline, setTagline] = useState("Fashion that celebrates Zambia");
  const [color, setColor] = useState(colors[0]);
  const [mood, setMood] = useState("Natural & warm");
  const [button, setButton] = useState("Filled");
  const [notice, setNotice] = useState("");
  const [previewMode, setPreviewMode] = useState("Mobile");
  const selectedStep = customize
    ? tab === "Branding"
      ? 2
      : tab === "Contact & delivery"
        ? 3
        : 1
    : step;
  return (
    <>
      <WorkspaceHead
        eyebrow={customize ? "STOREFRONT SETTINGS" : undefined}
        title={customize ? "Customize your storefront" : "Create your store"}
        subtitle={
          customize
            ? "Make your store feel like you. Tell your story and attract more customers."
            : "Set up your beautiful store in four simple steps and start reaching customers across Zambia."
        }
      />
      {customize ? (
        <nav className="tabs" aria-label="Store editor tabs">
          {["General", "Branding", "Contact & delivery", "Business hours"].map(
            (t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ),
          )}
        </nav>
      ) : (
        <nav className="wizard-steps" aria-label="Store creation steps">
          {[
            ["Business info", "Tell us about your business"],
            ["Brand & theme", "Make it yours"],
            ["Contact & delivery", "Help customers reach you"],
            ["Preview & launch", "Check it all looks good"],
          ].map(([t, s], i) => (
            <button
              key={t}
              onClick={() => {
                setStep(i + 1);
                setNotice("");
              }}
              className={`wizard-step ${step >= i + 1 ? "active" : ""}`}
              aria-current={step === i + 1 ? "step" : undefined}
            >
              <span>{step > i + 1 ? <Check size={10} /> : i + 1}</span>
              <strong>{t}</strong>
              <small>{s}</small>
            </button>
          ))}
        </nav>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!customize && step < 4) {
            setStep(step + 1);
            setNotice("");
          } else {
            setNotice(
              "Your example storefront is ready to preview. This demo has not created or published a store.",
            );
          }
        }}
      >
        <div className="workspace-grid wide-aside">
          <div>
            {customize && tab === "Business hours" ? (
              <Hours />
            ) : selectedStep === 1 ? (
              <>
                <div className="panel">
                  <h2>
                    {customize ? "General information" : "Business information"}
                  </h2>
                  <p>
                    Let’s start with the basics. Tell customers who you are and
                    what makes you special.
                  </p>
                  <div className="form-grid">
                    <Field label="Business name *">
                      <input
                        required
                        maxLength={80}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Field>
                    <Field label="Category *">
                      <select>
                        <option>Fashion</option>
                        <option>Beauty</option>
                        <option>Home</option>
                        <option>Food</option>
                        <option>Electronics</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="City *">
                    <select>
                      <option>Lusaka</option>
                      <option>Kitwe</option>
                      <option>Ndola</option>
                      <option>Livingstone</option>
                    </select>
                  </Field>
                  <Field
                    label="WhatsApp number"
                    hint="Use your own business number when creating a real store."
                  >
                    <input type="tel" placeholder="+260 …" />
                  </Field>
                  <Field label="Short store description">
                    <textarea defaultValue="Modern African fashion for everyday you. We create stylish pieces inspired by Zambian culture, made for comfort, everyday living and a little joy." />
                  </Field>
                </div>
                <div className="panel">
                  <h2>Brand & media</h2>
                  <p>
                    Add your logo and cover image to make your store stand out.
                  </p>
                  <div className="asset-row">
                    <StoreBadge />
                    <Photo
                      src="/images/seller-hero.webp"
                      alt="Example storefront cover"
                    />
                  </div>
                  <p>These illustrative assets are used in your preview.</p>
                  <div className="color-options" aria-label="Store theme color">
                    {colors.map((c) => (
                      <button
                        type="button"
                        key={c}
                        aria-label={`Choose theme ${c}`}
                        aria-pressed={color === c}
                        className={color === c ? "selected" : ""}
                        style={{ background: c }}
                        onClick={() => setColor(c)}
                      >
                        {color === c && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
                {customize && <Contact />}
              </>
            ) : selectedStep === 2 ? (
              <>
                <div className="panel">
                  <h2>Store branding</h2>
                  <p>Add a little personality to your corner of Bemba.</p>
                  <div className="asset-row">
                    <StoreBadge />
                    <Photo
                      src="/images/seller-hero.webp"
                      alt="Sample store cover"
                    />
                  </div>
                  <Field label="Business tagline">
                    <input
                      maxLength={90}
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />
                  </Field>
                </div>
                <div className="panel">
                  <h2>Theme colors</h2>
                  <p>Choose a colour that feels like your business.</p>
                  <div className="color-options">
                    {colors.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className={c === color ? "selected" : ""}
                        style={{ background: c }}
                        aria-label={`Theme ${c}`}
                        aria-pressed={color === c}
                        onClick={() => setColor(c)}
                      >
                        {color === c && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                  <h3 className="mt-6">Button style</h3>
                  <div className="choice-grid">
                    {["Filled", "Outlined"].map((v) => (
                      <button
                        type="button"
                        className={`choice-card ${button === v ? "selected" : ""}`}
                        key={v}
                        onClick={() => setButton(v)}
                        aria-pressed={button === v}
                      >
                        <span
                          style={{
                            display: "block",
                            padding: "8px",
                            borderRadius: 4,
                            border: `1px solid ${color}`,
                            background: v === "Filled" ? color : "white",
                            color: v === "Filled" ? "white" : color,
                          }}
                        >
                          {v}
                        </span>
                      </button>
                    ))}
                  </div>
                  <h3 className="mt-6">Storefront mood</h3>
                  <div className="choice-grid">
                    {[
                      "Natural & warm",
                      "Bold & colourful",
                      "Minimal & clean",
                      "Rooted & earthy",
                    ].map((v, i) => (
                      <button
                        key={v}
                        type="button"
                        className={`choice-card ${mood === v ? "selected" : ""}`}
                        aria-pressed={mood === v}
                        onClick={() => setMood(v)}
                      >
                        <Photo
                          className="h-20 rounded"
                          src={
                            [
                              "/images/basket.webp",
                              "/images/handbag.webp",
                              "/images/skincare.webp",
                              "/images/plant.webp",
                            ][i]
                          }
                          alt=""
                        />
                        <strong>{v}</strong>
                      </button>
                    ))}
                  </div>
                  <p>
                    Selected mood: {mood}. The full theme preview will be
                    available when publishing is connected.
                  </p>
                </div>
              </>
            ) : selectedStep === 3 ? (
              <>
                <Contact />
                <div className="panel">
                  <h2>Delivery & pickup</h2>
                  {[
                    "Local delivery (Lusaka)",
                    "Nationwide delivery",
                    "Customer pickup",
                  ].map((x, i) => (
                    <label className="toggle-row" key={x}>
                      <span>
                        {x}
                        <small>
                          Confirm arrangements directly with your customer.
                        </small>
                      </span>
                      <input type="checkbox" defaultChecked={i !== 1} />
                    </label>
                  ))}
                  <Field label="Pickup instructions">
                    <textarea placeholder="Share useful pickup details for your customers…" />
                  </Field>
                </div>
                <Hours />
              </>
            ) : (
              <>
                <div className="panel">
                  <h2>Store setup checklist</h2>
                  <p>Take a moment to make sure everything feels right.</p>
                  <ul className="checklist">
                    {[
                      ["Business information", name],
                      ["Brand & theme", `${mood} · ${tagline}`],
                      ["Contact & delivery", "Review your contact details"],
                      ["Product details", "Add products after store creation"],
                    ].map(([title, sub], i) => (
                      <li key={title}>
                        <CheckCircle2 />
                        <div>
                          <strong>{title}</strong>
                          <small>{sub}</small>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(Math.min(i + 1, 3))}
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="panel">
                  <h2>Store summary</h2>
                  <ul className="checklist">
                    <li>
                      <Store />
                      <div>
                        <strong>{name}</strong>
                        <small>Fashion · Lusaka, Zambia</small>
                      </div>
                    </li>
                    <li>
                      <MapPin />
                      <div>
                        <strong>Contact & pickup</strong>
                        <small>
                          Confirm your real business details before publishing.
                        </small>
                      </div>
                    </li>
                    <li>
                      <Eye />
                      <div>
                        <strong>Design preview</strong>
                        <small>No store has been published.</small>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="panel ai-panel">
                  <h2>A little closer to your big idea.</h2>
                  <p>
                    Your preview is ready to explore. A real store requires a
                    signed-in account, saved details and moderation approval.
                  </p>
                  <Link href="/demo/store" className="btn btn-small mt-4">
                    Explore example store <ArrowRight size={13} />
                  </Link>
                </div>
              </>
            )}
          </div>
          <aside className="preview-panel">
            <div className="preview-label">
              <span className="status-dot" />
              Live preview <span>{previewMode}</span>
            </div>
            <div className="tabs">
              <button
                type="button"
                className={previewMode === "Mobile" ? "active" : ""}
                onClick={() => setPreviewMode("Mobile")}
              >
                Mobile
              </button>
              <button
                type="button"
                className={previewMode === "Desktop" ? "active" : ""}
                onClick={() => setPreviewMode("Desktop")}
              >
                Desktop
              </button>
            </div>
            {previewMode === "Mobile" ? (
              <PhonePreview
                name={name || "Your store"}
                tagline={tagline}
                color={color}
              />
            ) : (
              <div className="preview-desktop">
                <StoreBanner />
                <h3 className="my-3">{name}</h3>
                <div className="products-grid">
                  {demoProducts.slice(0, 6).map((p) => (
                    <ProductCard product={p} key={p.id} />
                  ))}
                </div>
              </div>
            )}
            <GrowthCard />
          </aside>
        </div>
        {notice && (
          <p role="status" className="inline-notice">
            {notice}
          </p>
        )}
        <div className="form-actions">
          {!customize && step > 1 && (
            <button
              type="button"
              className="text-link"
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            className="btn btn-white"
            onClick={() =>
              setNotice(
                "Preview only. This form does not save a draft to your account.",
              )
            }
          >
            Preview draft
          </button>
          <button className="btn" type="submit">
            {customize
              ? "Preview changes"
              : step < 4
                ? "Continue to next step"
                : "Finish preview"}{" "}
            <ArrowRight size={13} />
          </button>
        </div>
      </form>
    </>
  );
}
function Contact() {
  return (
    <div className="panel">
      <h2>Contact information</h2>
      <p>Make it easy for customers to reach you.</p>
      <div className="form-grid">
        <Field label="WhatsApp number">
          <input type="tel" placeholder="+260 …" />
        </Field>
        <Field label="Phone number">
          <input type="tel" placeholder="+260 …" />
        </Field>
      </div>
      <Field label="Email address">
        <input type="email" placeholder="you@yourbusiness.com" />
      </Field>
      <Field label="Store location">
        <input defaultValue="Lusaka, Zambia" />
      </Field>
      <label className="toggle-row">
        <span>
          Show location on my storefront
          <small>Use a business location you want to share publicly.</small>
        </span>
        <input type="checkbox" defaultChecked />
      </label>
    </div>
  );
}
function Hours() {
  return (
    <div className="panel">
      <h2>Business hours</h2>
      <p>Let your customers know when you’re available.</p>
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day, i) => (
        <div className="hours-row" key={day}>
          <label>
            <input type="checkbox" defaultChecked={i < 6} /> {day}
          </label>
          <input
            aria-label={`${day} opening time`}
            type="time"
            defaultValue="09:00"
          />
          <span>–</span>
          <input
            aria-label={`${day} closing time`}
            type="time"
            defaultValue={i === 5 ? "14:00" : "18:00"}
          />
        </div>
      ))}
    </div>
  );
}
