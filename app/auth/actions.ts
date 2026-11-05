"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ACCOUNT_KIND,
  DEPARTMENT_NAME,
  REGISTRATION_NOTICE_VERSION,
  authRedirectUrl,
} from "@/lib/auth/registration";

function credentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return null;
  return { email: normalized, password };
}

export async function signIn(formData: FormData) {
  const input = credentials(formData);
  if (!input) redirect("/login?error=credentials");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(input);
  if (error) redirect("/login?error=credentials");
  redirect("/");
}

export async function registerUser(formData: FormData) {
  const input = credentials(formData);
  const repeat = formData.get("confirm_password");
  const noticeAccepted = formData.get("notice_ack") === "on";

  if (!input || input.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    redirect("/register?error=email");
  }

  if (input.password.length < 8 || input.password.length > 128) {
    redirect("/register?error=password");
  }

  if (typeof repeat !== "string" || input.password !== repeat) {
    redirect("/register?error=mismatch");
  }

  if (!noticeAccepted) {
    redirect("/register?error=notice");
  }

  const supabase = await createClient();

  // Notice metadata records what this form submitted. It is not trusted
  // for identity, authorization, or proof of independent email verification.
  // The database trigger, not this field, assigns the regular 'user' role.
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: authRedirectUrl(),
      data: {
        registration_notice_version: REGISTRATION_NOTICE_VERSION,
        registration_account_kind: ACCOUNT_KIND,
        registration_department_label: DEPARTMENT_NAME,
      },
    },
  });

  if (error) redirect("/register?error=signup");
  if (data.session) redirect("/");

  // With Supabase email confirmation enabled, signup produces no session.
  redirect("/login?registered=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
