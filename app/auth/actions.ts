"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function credentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  const normalized = email.trim();
  if (!normalized || !password) return null;
  return { email: normalized, password };
}

export async function signIn(formData: FormData) {
  const input = credentials(formData);
  if (!input) redirect("/login?error=1");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(input);

  if (error) redirect("/login?error=1");
  redirect("/");
}

export async function registerUser(formData: FormData) {
  const input = credentials(formData);
  if (!input || input.password.length < 8) redirect("/register?error=1");

  const supabase = await createClient();
  // No role or metadata is accepted from the registration form. Database
  // signup trigger assigns 'user', never 'dept_admin'.
  const { data, error } = await supabase.auth.signUp(input);

  if (error) redirect("/register?error=1");
  if (data.session) redirect("/");

  // Projects with email confirmation enabled require verification first.
  redirect("/login?registered=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
