import "server-only";

function parseSiteUrl(): URL {
  const raw = process.env.SITE_URL;
  if (!raw) return new URL("http://localhost:3000");
  try {
    const formatted = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
    return new URL(formatted);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const site = {
  name: "Bemba",
  description: "Branded storefronts for Zambian businesses. Discover products and contact sellers directly on WhatsApp.",
  url: parseSiteUrl(),
  indexable: process.env.APP_ENV === "production",
};

if (site.indexable && site.url.protocol !== "https:") {
  throw new Error("Production SITE_URL must be an HTTPS URL.");
}
