"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main" className="mx-auto min-h-[60vh] max-w-4xl px-5 py-20"><h1 className="font-display text-4xl">We couldn’t load this page.</h1><p className="my-6 text-muted-foreground">Please try again in a moment.</p><Button onClick={reset}>Try again</Button></main>;
}
