// Signup information is not an authorization source.
// The department_roles trigger in Supabase always assigns 'user'.
export const REGISTRATION_NOTICE_VERSION = "temp-account-notice-2026-11-05-v1";

export const DEPARTMENT_NAME = "Anime";
export const ACCOUNT_KIND = "viewer";

// Controlled server-side fallback. Override with NEXT_PUBLIC_APP_URL in
// local development or when changing the deployed domain.
export const DEFAULT_APP_ORIGIN = "https://tempanime-five.vercel.app";

export function authRedirectUrl() {
  const origin = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_ORIGIN;
  return new URL("/auth/callback", origin).toString();
}
