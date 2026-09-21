import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/bemba/footer";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: site.url,
  title: {
    default: "Bemba — Local businesses. Bigger possibilities.",
    template: "%s | Bemba",
  },
  description: site.description,
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only fixed top-3 left-3 z-50 rounded bg-primary p-3 text-white focus:not-sr-only"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
