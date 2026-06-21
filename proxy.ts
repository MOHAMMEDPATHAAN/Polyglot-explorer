import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Renamed from middleware.ts per the Next.js 16 migration: the "proxy" file
// convention replaces "middleware" and runs on the Node.js runtime (not Edge),
// which is required here since @supabase/ssr is not Edge-runtime compatible.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
