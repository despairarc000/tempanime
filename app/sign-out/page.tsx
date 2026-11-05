import { signOut } from "@/app/auth/actions";

export default function SignOutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form action={signOut}><button type="submit" className="rounded border px-4 py-2">Sign out</button></form>
    </main>
  );
}
