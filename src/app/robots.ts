import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/auth/", "/dashboard/", "/admin/", "/onboarding/", "/account/", "/api/"] },
    sitemap: new URL("/sitemap.xml", site.url).href,
  };
}
