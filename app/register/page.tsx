import Link from "next/link";
import { redirect } from "next/navigation";
import { registerUser } from "@/app/auth/actions";
import { getDepartmentAccess, landingPath } from "@/lib/auth/access";
import {
  ACCOUNT_KIND,
  DEPARTMENT_NAME,
  REGISTRATION_NOTICE_VERSION,
} from "@/lib/auth/registration";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const errors: Record<string, string> = {
  email: "Enter a valid email address.",
  password: "Use a password between 8 and 128 characters.",
  mismatch: "The passwords do not match.",
  notice: "Read and acknowledge the account notice before continuing.",
  signup: "We could not create the account. Please try again.",
};

export default async function RegisterPage({ searchParams }: Props) {
  const access = await getDepartmentAccess();
  if (access.status === "ready") redirect(landingPath(access.role));
  if (access.status === "unavailable") redirect("/access-unavailable");

  const { error } = await searchParams;
  const message = error ? errors[error] || errors.signup : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-10">
      <section className="w-full max-w-md space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Create your {ACCOUNT_KIND} account</h1>
          <p className="text-sm text-gray-600">
            {DEPARTMENT_NAME} · Sign up as a regular user. Department admin
            access is assigned separately and cannot be requested here.
          </p>
        </header>
        {message && (
          <p role="alert" className="rounded border border-red-400 p-3 text-sm">
            {message}
          </p>
        )}
        <form action={registerUser} className="space-y-4">
          <label htmlFor="email" className="block space-y-1">
            <span className="text-sm font-medium">Email address</span>
            <input id="email" name="email" type="email" required maxLength={254}
              autoComplete="email" className="block w-full rounded border px-3 py-2" />
          </label>
          <label htmlFor="password" className="block space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input id="password" name="password" type="password" minLength={8}
              maxLength={128} required autoComplete="new-password"
              className="block w-full rounded border px-3 py-2" />
            <span className="text-xs text-gray-600">8–128 characters.</span>
          </label>
          <label htmlFor="confirm_password" className="block space-y-1">
            <span className="text-sm font-medium">Confirm password</span>
            <input id="confirm_password" name="confirm_password" type="password"
              minLength={8} maxLength={128} required autoComplete="new-password"
              className="block w-full rounded border px-3 py-2" />
          </label>
          <section className="space-y-3 rounded border p-4 text-sm" aria-label="Account notice">
            <h2 className="font-semibold">Account-use notice</h2>
            <p>
              Your email is used by {DEPARTMENT_NAME} to create and secure
              your account, send authentication messages, and support account
              access. Your password is handled by Supabase Auth and is not
              included in a public user profile.
            </p>
            <p>
              This account belongs only to the {DEPARTMENT_NAME} department;
              it does not sign you into another Loxada department.
              Registration does not purchase a subscription or grant supplier
              or administrator permissions.
            </p>
            <label htmlFor="notice_ack" className="flex items-start gap-2">
              <input id="notice_ack" name="notice_ack" type="checkbox"
                value="on" required className="mt-1" />
              <span>I have read the account-use notice above.</span>
            </label>
            <p className="text-xs text-gray-600">
              Temporary account notice: {REGISTRATION_NOTICE_VERSION}
            </p>
          </section>
          <button className="w-full rounded bg-black px-4 py-3 font-medium text-white"
            type="submit">Create account</button>
        </form>
        <p className="text-sm">
          Already registered? <Link className="underline" href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
