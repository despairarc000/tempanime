-- Loxada department starter: ONLY user and dept_admin are implemented.
-- This SQL was applied to this project's Supabase database via migration management.
-- Do not rerun blindly; inspect existing objects and migration history first.
create table public.department_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'dept_admin')),
  created_at timestamptz not null default now()
);
alter table public.department_roles enable row level security;
revoke all on table public.department_roles from public, anon, authenticated;
grant select on table public.department_roles to authenticated;
create policy "authenticated users read only their own role"
  on public.department_roles for select to authenticated
  using ((select auth.uid()) = user_id);

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;
create function app_private.initialize_department_role()
returns trigger language plpgsql security definer set search_path = ''
as $function$
begin
  insert into public.department_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$function$;
revoke all on function app_private.initialize_department_role() from public, anon, authenticated;
create trigger initialize_department_role_on_signup
  after insert on auth.users
  for each row execute function app_private.initialize_department_role();

insert into public.department_roles (user_id, role)
select id, 'user' from auth.users
on conflict (user_id) do nothing;
