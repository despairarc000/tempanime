import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Used when the Supabase Confirm signup email template sends a token_hash link.
// Never redirect to an untrusted user-provided destination.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (!tokenHash || type !== "email") {
    return NextResponse.redirect(new URL("/login?error=verify", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });

  return NextResponse.redirect(
    new URL(error ? "/login?error=verify" : "/", request.url),
  );
}
