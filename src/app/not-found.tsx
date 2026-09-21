import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main id="main" className="mx-auto min-h-[60vh] max-w-4xl px-5 py-20"><p className="text-primary">404</p><h1 className="mt-3 font-display text-4xl">This page isn’t here.</h1><p className="my-6 text-muted-foreground">The link may have changed, or this page is not available.</p><Button asChild><Link href="/">Back to Bemba</Link></Button></main>;
}
