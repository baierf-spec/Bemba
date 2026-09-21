import Link from "next/link";
import {
  Package,
  Store,
  Settings,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { requireAccount } from "@/lib/auth/access";
import { SellerShell, WorkspaceHead } from "@/components/bemba/seller-shell";
import { GrowthCard } from "@/components/bemba/shared";
export default async function Dashboard() {
  const { supabase, user } = await requireAccount();
  const [profile, store] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase
      .from("stores")
      .select("id,name,publication")
      .eq("owner_id", user.id)
      .maybeSingle(),
  ]);
  if (profile.error || store.error)
    throw new Error("Your account could not be loaded");
  return (
    <main id="main" className="real-account">
      <SellerShell demo={false}>
        <WorkspaceHead
          eyebrow="YOUR SELLER HUB"
          title={`Welcome, ${profile.data.display_name || "seller"}`}
          subtitle="Your business. Your store. A little more possibility."
        />
        <div className="workspace-grid">
          <div>
            <div className="panel">
              <div className="panel-header">
                <h2>Your account</h2>
                <ShieldCheck size={24} className="text-primary" />
              </div>
              <p>{user.email}</p>
              {store.data ? (
                <div className="inline-notice">
                  <strong>{store.data.name}</strong> · {store.data.publication}
                </div>
              ) : (
                <div className="empty-state">
                  <Store size={35} />
                  <h2>A home for your business.</h2>
                  <p>
                    You haven’t created a storefront yet. Explore the store
                    creation preview while publishing is being connected.
                  </p>
                  <Link href="/demo/onboarding/1" className="btn">
                    Preview store setup <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
            <div className="mini-panels">
              <Link className="panel" href="/dashboard/settings">
                <Settings size={24} className="mb-3 text-primary" />
                <h2>Account settings</h2>
                <p>Manage your saved profile.</p>
              </Link>
              <Link className="panel" href="/demo/dashboard/products">
                <Package size={24} className="mb-3 text-primary" />
                <h2>Explore products</h2>
                <p>See the product-management design preview.</p>
              </Link>
            </div>
            <form action="/auth/session" method="post">
              <input type="hidden" name="intent" value="logout" />
              <button className="btn btn-white">Sign out</button>
            </form>
          </div>
          <aside>
            <GrowthCard />
            <div className="panel mt-4">
              <h3>Your account stays private.</h3>
              <p>
                Only you can see your account details. Design previews use
                separate, illustrative content.
              </p>
            </div>
          </aside>
        </div>
      </SellerShell>
    </main>
  );
}
