import { createBrowserClient } from "@supabase/ssr";

// Browser client. createBrowserClient reuses one instance per page, so calling this
// from several components is cheap. Only call it in event handlers and effects:
// the env vars are read at runtime and pages are prerendered without them.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
