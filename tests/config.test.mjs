import test from "node:test";
import assert from "node:assert/strict";
import { getSupabaseConfig } from "../src/lib/supabase/config.ts";

test("Supabase configuration fails closed instead of returning demo data", () => {
  const beforeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const beforeKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  try {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    assert.throws(getSupabaseConfig, /not configured/);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://external.example";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-only-key";
    assert.throws(getSupabaseConfig, /HTTPS/);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    assert.equal(getSupabaseConfig().url, "http://127.0.0.1:54321");
  } finally {
    if (beforeUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = beforeUrl;
    if (beforeKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = beforeKey;
  }
});
