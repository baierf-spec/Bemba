import "server-only";

export const site = {
  name: "Bemba",
  description: "Branded storefronts for Zambian businesses. Discover products and contact sellers directly on WhatsApp.",
  url: new URL(process.env.SITE_URL || "http://localhost:3000"),
  indexable: process.env.APP_ENV === "production",
};

if (site.indexable && site.url.protocol !== "https:") {
  throw new Error("Production SITE_URL must be an HTTPS URL.");
}
