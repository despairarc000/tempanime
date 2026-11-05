# Loxada Anime — role-routing foundation

Minimal Next.js + Supabase starter for the Anime department. Suppliers are deliberately not implemented.

## Current roles and destinations

| Role | Assigned by | Authorized destination |
| --- | --- | --- |
| `user` | Database trigger on registration | `/home` (blank) |
| `dept_admin` | Trusted database owner only | `/admin/home` (blank) |

- `/` redirects according to the verified server-side Supabase identity and `public.department_roles` row.
- `/home` and `/admin/home` verify identity **and** role on the server before returning the empty page.
- Unauthenticated visitors go to `/login`. Missing/inaccessible roles fail closed to `/access-unavailable`.
- `/login` and `/register` are minimal functional authentication pages. New accounts are always regular `user` accounts; supplier onboarding is intentionally deferred.
- `/sign-out` provides a simple logout control without putting UI on either blank home page.
- The proxy refreshes server-side auth cookies but does not grant roles.
- The two departments use independent Supabase Auth databases and role tables. Equal emails do not merge their identities.
- This is an initial route-level RBAC gate. Future admin server actions, tables, API endpoints and features **must implement independent backend/RLS authorization** before being added.

## Promote a specifically authorized department admin

Register the person's account in this department first. In the Supabase SQL Editor of **tempanimedb**, a trusted project owner can run (replace the placeholder with the intended email):

```sql
update public.department_roles
set role = 'dept_admin'
where user_id = (select id from auth.users where email = 'actual-admin@example.com');
```

This operation is **not** available from registration, a browser, editable user metadata, or a normal account. The trigger inserts every new account with `user` status. Only trusted database operators can change a role. No administrator is pre-created or assumed.

## Project setup

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to this department's own Supabase connection values (the existing Vercel integration provides them).
2. `npm install` then `npm run dev`; `npm run build` verifies a production build.
3. In Supabase Authentication settings, configure the intended site URL, email-confirmation behavior and redirect allowlist before inviting real users.
4. The SQL in `database/department_role_foundation.sql` documents the schema already applied on this project. Do not apply it twice without checking migration history.

No supplier roles, catalog features, streaming/publishing operations or business permissions are implied by this skeleton.
