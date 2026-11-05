# Loxada Anime — temporary authentication and role shell

This repository is a **minimal** Next.js + Supabase web application. It is not a running reader/streaming catalog, subscription system, or supplier portal. Two protected home routes intentionally render blank pages.

## Registration: normal viewer accounts

The form at `/register` collects only:

1. Email address — the Supabase login/contact identifier.
2. Password — 8–128 characters; stored by Supabase Auth (not in an application profile).
3. Password confirmation — compared server-side, **not persisted**.
4. Acknowledgment that the user read the on-screen, versioned account-use notice.

No legal name, phone number, postal address, DOB, payment details, public username, or subscription choice is requested at signup. The selected v1.0 account definitions do not demand those fields at registration. The email can serve as the Anime login handle.

The server validates email format/length, password length, password confirmation, and notice acknowledgment before calling Supabase `signUp`. The notice version is included in *user-editable* signup metadata as a descriptive registration submission record; it must never be trusted for authorization or treated as independent proof of the notice/privacy lifecycle. Only the database trigger assigns the new account role `user`; self-selection of `dept_admin` is not supported.

### Email confirmation handling

- `/auth/callback` exchanges a Supabase PKCE `code` for a cookie session when an email template redirects back to the app.
- `/auth/confirm` verifies a Supabase `token_hash` of type `email` if that style of email template is configured.
- `/login` displays registration/verification guidance. If Supabase requires confirmation, signup returns no session and the user verifies their email before signing in.
- The code **does not control whether email confirmation is enabled**, whether mail delivery is working, or the Supabase redirect allowlist. Configure and test these in the department's own Supabase dashboard before inviting people.

#### Supabase configuration required for confirmation emails

1. In **Authentication → Providers → Email**, enable the project's email-confirmation requirement if verification is intended.
2. Under **Authentication → URL Configuration**, set Site URL to `https://tempanime-five.vercel.app` and allow `https://tempanime-five.vercel.app/auth/callback` (and local development URLs if used). The signup server action uses `NEXT_PUBLIC_APP_URL` if present, otherwise the fixed production domain above.
3. For a direct token-hash confirmation link, change the **Confirm signup** email template to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`. Alternatively, retain the default confirmation link; the `/auth/callback` route is present for redirects that include a PKCE `code`.
4. If the production sender limits emails, configure an appropriate verified SMTP provider. **Email delivery and signup have not been end-to-end tested with actual accounts.**

## Implemented access boundaries

| Role | Assigned by | Route |
| --- | --- | --- |
| `user` | Database trigger at account creation | `/home` (blank) |
| `dept_admin` | Trusted database operator, never a public form | `/admin/home` (blank) |

`/` redirects by server-verified identity and a `public.department_roles` lookup. `/home` and `/admin/home` check both authentication and the required role on the server. Unauthenticated visitors go to `/login`; unreadable/missing roles go to `/access-unavailable`. `/sign-out` provides a simple logout. The proxy refreshes cookies but does **not** enforce global role authorization for future pages/APIs.

The two departments have independent Supabase identities. Equal emails do not merge accounts across departments.

## Local development

```sh
npm install
cp .env.example .env.local
# Fill in your Supabase URL/key; set NEXT_PUBLIC_APP_URL to your local origin.
npm run dev
npm run build
```

In the dashboard, also allowlist your local confirmation callback. The live Vercel integration already provides the department-specific Supabase URL and publishable key; no private service key is required in browser code.

## Database

The single `public.department_roles` table, RLS policy, signup trigger and `app_private` function are documented in `database/department_role_foundation.sql`, which was already applied to this department's Supabase project. **Do not rerun that SQL blindly.**

A trusted database operator may promote a previously registered, intended account by finding its `auth.users.id` and updating `public.department_roles` to `dept_admin`. Ordinary authenticated users have no INSERT/UPDATE privileges on the roles table.

**Not implemented:** supplier account types, business pages, manga chapter publishing, anime video ingestion/streaming, subscription payments, comprehensive authorization for future business endpoints, and a full account recovery/closure service.
