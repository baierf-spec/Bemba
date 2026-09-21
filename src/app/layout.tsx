import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: site.url,
  title: { default: "Bemba — Local businesses. Bigger possibilities.", template: "%s | Bemba" },
  description: site.description,
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main" className="sr-only fixed top-3 left-3 z-50 rounded bg-primary p-3 text-white focus:not-sr-only">Skip to content</a>
        <SiteHeader />
        {children}
        <footer className="mt-12 bg-primary px-5 py-9 text-primary-foreground sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm sm:flex-row">
            <p className="text-lg font-bold">Bemba<span className="mt-1 block text-sm font-normal text-white/80">Local businesses. Bigger possibilities.</span></p>
            <p className="max-w-md leading-6 text-white/80">Discover products. Contact sellers directly.<br />Purchases and delivery are arranged with the seller.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
