import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/app/auth/actions";
import { getDepartmentAccess, landingPath } from "@/lib/auth/access";

type Props = {
  searchParams: Promise<{ error?: string; registered?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const access = await getDepartmentAccess();
  if (access.status === "ready") redirect(landingPath(access.role));
  if (access.status === "unavailable") redirect("/access-unavailable");

  const params = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="w-full max-w-sm space-y-5">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {params.error && <p role="alert">Sign-in failed. Check your details.</p>}
        {params.registered && <p>Account submitted. Confirm your email if prompted, then sign in.</p>}
        <form action={signIn} className="space-y-4">
          <label className="block space-y-1">
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email"
              className="block w-full rounded border px-3 py-2" />
          </label>
          <label className="block space-y-1">
            <span>Password</span>
            <input name="password" type="password" required autoComplete="current-password"
              className="block w-full rounded border px-3 py-2" />
          </label>
          <button className="rounded border px-4 py-2" type="submit">Sign in</button>
        </form>
        <p className="text-sm">New account? <Link className="underline" href="/register">Register</Link></p>
      </section>
    </main>
  );
}
