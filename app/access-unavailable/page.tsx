import { signOut } from "@/app/auth/actions";

export default function AccessUnavailablePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
      <p>Your account role is unavailable. Contact the department administrator.</p>
      <form action={signOut}><button type="submit" className="rounded border px-4 py-2">Sign out</button></form>
    </main>
  );
}
