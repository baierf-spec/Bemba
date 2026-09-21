import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No ISR/remote cache in M1. Add cache bindings only with tested invalidation.
export default defineCloudflareConfig();
