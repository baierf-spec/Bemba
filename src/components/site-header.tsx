"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/bemba/shared";
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const seller =
    path.startsWith("/dashboard") ||
    path.startsWith("/demo/dashboard") ||
    path.startsWith("/demo/onboarding");
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav
          aria-label="Main navigation"
          className={`main-nav ${open ? "is-open" : ""}`}
          onClick={() => setOpen(false)}
        >
          <Link href="/demo/marketplace">Discover</Link>
          <Link href="/#for-sellers">For Sellers</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#about">About</Link>
        </nav>
        <div className="header-actions">
          {seller ? (
            <>
              <Link href="/demo/store" className="header-store">
                View store <ArrowUpRight size={14} />
              </Link>
              <Link className="account-chip" href="/dashboard/settings">
                <span>CF</span>
                <span>
                  Seller account<small>Manage your business</small>
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/demo/marketplace"
                aria-label="Search products"
                className="header-search"
              >
                <Search size={19} />
              </Link>
              <Link href="/auth/login" className="sign-in">
                Sign in
              </Link>
              <Link href="/demo/onboarding/1" className="btn btn-small">
                Start selling
              </Link>
            </>
          )}
          <button
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
