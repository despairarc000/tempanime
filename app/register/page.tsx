import Link from "next/link";
import { redirect } from "next/navigation";
import { registerUser } from "@/app/auth/actions";
import { getDepartmentAccess, landingPath } from "@/lib/auth/access";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const access = await getDepartmentAccess();
  if (access.status === "ready") redirect(landingPath(access.role));
  if (access.status === "unavailable") redirect("/access-unavailable");

  const params = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="w-full max-w-sm space-y-5">
        <h1 className="text-xl font-semibold">Register</h1>
        <p className="text-sm">New accounts receive regular user access. Department admin access is assigned separately.</p>
        {params.error && <p role="alert">Registration failed. Check your details and password.</p>}
        <form action={registerUser} className="space-y-4">
          <label className="block space-y-1">
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email"
              className="block w-full rounded border px-3 py-2" />
          </label>
          <label className="block space-y-1">
            <span>Password (8+ characters)</span>
            <input name="password" type="password" minLength={8} required
              autoComplete="new-password" className="block w-full rounded border px-3 py-2" />
          </label>
          <button className="rounded border px-4 py-2" type="submit">Create account</button>
        </form>
        <p className="text-sm">Already registered? <Link className="underline" href="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
