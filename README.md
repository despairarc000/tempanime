# Loxada Anime

Minimal Next.js + Supabase application foundation for Loxada Entertainments.

## Current state

- The homepage is intentionally blank.
- Default Supabase starter tutorial, branded components, login/register/password-reset routes, protected demo and automatic login redirects have been removed.
- Supabase browser and server client helpers remain in `lib/supabase/` for future, deliberately designed application features.
- The connected Vercel and Supabase projects are retained. This repository does not add, remove or change database schemas, users or Supabase Auth configuration.
- Authentication, authorization, role policies and business workflows are **not implemented**. Do not assume access control exists merely because Supabase client helpers are present.

## Local development

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the **matching** Supabase project. Do not commit secrets.
3. Run `npm run dev`.
4. Run `npm run build` to verify the app.

The application is a blank foundation, not an implementation of the Loxada business specification.
