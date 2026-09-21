import Link from "next/link";
import { Photo } from "@/components/bemba/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const inputClass =
  "mt-2 block w-full rounded-lg border border-border bg-white p-3";
export function AuthForm({
  intent,
  title,
  error,
}: {
  intent: "login" | "register" | "recover" | "reset";
  title: string;
  error?: string;
}) {
  return (
    <main id="main" className="auth-designed">
      <div className="auth-story">
        <Photo
          src="/images/seller-hero.webp"
          alt="Illustrative local fashion boutique"
        />
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2>
            Small business.
            <br />
            Big possibilities.
          </h2>
          <p>A home for your products. A place to grow.</p>
        </div>
      </div>
      <Card className="auth-card">
        <p className="eyebrow mb-3">WELCOME TO BEMBA</p>
        <h1 className="font-display text-3xl">{title}</h1>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-800">
            {error === "invalid_credentials"
              ? "Sign-in failed. Check your details and confirm your email."
              : "We couldn’t complete that request. Check your details and try again."}
          </p>
        )}
        <form action="/auth/session" method="post" className="mt-6 space-y-5">
          <input type="hidden" name="intent" value={intent} />
          {intent === "register" && (
            <label className="block">
              Your name
              <input
                className={inputClass}
                name="display_name"
                required
                maxLength={120}
                autoComplete="name"
              />
            </label>
          )}
          {intent !== "reset" && (
            <label className="block">
              Email
              <input
                className={inputClass}
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
              />
            </label>
          )}
          {intent !== "recover" && (
            <label className="block">
              Password
              <input
                className={inputClass}
                name="password"
                type="password"
                required
                minLength={12}
                maxLength={128}
                autoComplete={
                  intent === "login" ? "current-password" : "new-password"
                }
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                At least 12 characters.
              </span>
            </label>
          )}
          <Button type="submit">{title}</Button>
        </form>
        <div className="mt-6 flex flex-wrap gap-4 text-sm underline">
          <Link href="/auth/login">Sign in</Link>
          <Link href="/auth/register">Create account</Link>
          <Link href="/auth/forgot-password">Forgot password?</Link>
        </div>
      </Card>
    </main>
  );
}
