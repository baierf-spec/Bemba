import Link from "next/link";
import { Sprout, ArrowUpRight } from "lucide-react";
import { Brand } from "./shared";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Brand light />
          <p>Local businesses. A brighter Africa.</p>
          <small>© {new Date().getFullYear()} Bemba.</small>
        </div>
        <nav aria-label="Footer">
          <Link href="/demo/marketplace">Discover</Link>
          <Link href="/#for-sellers">For sellers</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#about">About</Link>
        </nav>
        <div className="footer-message">
          <Sprout />
          <p>
            Made with care for Zambia.
            <br />
            Local today. A brighter tomorrow.
          </p>
          <Link href="/demo/dashboard">
            Explore the design preview <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
