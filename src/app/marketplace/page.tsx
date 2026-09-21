import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function Marketplace() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  let count = 0;
  let failed = false;
  if (configured) {
    try {
      const supabase = await createClient({ readOnly: true });
      const { count: total, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true });
      if (error) failed = true;
      else count = total || 0;
    } catch {
      failed = true;
    }
  }
  return (
    <main id="main" className="page-container">
      <div className="center-heading">
        <p className="eyebrow">LOCAL BUSINESSES. BIG POSSIBILITIES.</p>
        <h1>Discover something special.</h1>
      </div>
      <div className="empty-state">
        <PackageSearch size={35} />
        <h2>
          {failed
            ? "We couldn’t load the marketplace."
            : count
              ? "The catalog is being prepared."
              : "Our marketplace is getting ready."}
        </h2>
        <p>
          {failed
            ? "Please try again later."
            : configured
              ? "The complete public catalog experience is being connected."
              : "Explore the design with clearly labelled sample products while the live marketplace is prepared."}
        </p>
        <Link className="btn" href="/demo/marketplace">
          Explore the design preview →
        </Link>
      </div>
    </main>
  );
}
