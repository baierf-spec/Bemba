import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

export async function createClient({ readOnly = false }: { readOnly?: boolean } = {}) {
  const { url, key } = getSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(items) {
        // Middleware refreshes incoming cookies before Server Components run.
        if (!readOnly) items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
