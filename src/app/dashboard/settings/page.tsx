import { requireAccount } from "@/lib/auth/access";
import { SellerShell, WorkspaceHead } from "@/components/bemba/seller-shell";
import { GrowthCard } from "@/components/bemba/shared";
import { updateProfile } from "./actions";
export default async function Settings({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { supabase, user } = await requireAccount();
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();
  if (error) throw new Error("Could not load profile");
  const status = await searchParams;
  return (
    <main id="main" className="real-account">
      <SellerShell demo={false}>
        <WorkspaceHead
          eyebrow="SETTINGS"
          title="Your account settings"
          subtitle="A little about you. Keep your profile up to date."
        />
        <div className="workspace-grid">
          <div className="panel">
            <h2>Profile information</h2>
            <p>These details belong to your signed-in account.</p>
            {status.error && (
              <p role="alert" className="inline-notice error-notice">
                We couldn’t save your changes.
              </p>
            )}
            {status.saved && (
              <p role="status" className="inline-notice">
                Profile saved.
              </p>
            )}
            <form action={updateProfile}>
              <label className="field">
                <span>Your name</span>
                <input
                  name="display_name"
                  defaultValue={data.display_name}
                  maxLength={120}
                  required
                />
              </label>
              <label className="field">
                <span>Email address</span>
                <input value={user.email || ""} readOnly />
                <small>Your verified sign-in email.</small>
              </label>
              <div className="form-actions">
                <button className="btn">Save profile</button>
              </div>
            </form>
          </div>
          <aside>
            <GrowthCard />
          </aside>
        </div>
      </SellerShell>
    </main>
  );
}
