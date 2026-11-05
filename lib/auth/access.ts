import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type DepartmentRole = "dept_admin" | "user";

type Access =
  | { status: "signed_out" }
  | { status: "unavailable" }
  | { status: "ready"; role: DepartmentRole };

export function landingPath(role: DepartmentRole) {
  return role === "dept_admin" ? "/admin/home" : "/home";
}

/**
 * Read the authoritative role from the database on every protected request.
 * Never trust user_metadata, browser state, form fields or a role query string.
 */
export async function getDepartmentAccess(): Promise<Access> {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    return { status: "signed_out" };
  }

  const { data: membership, error: roleError } = await supabase
    .from("department_roles")
    .select("role")
    .eq("user_id", auth.user.id)
    .single();

  if (roleError || !membership) {
    return { status: "unavailable" };
  }

  if (membership.role !== "dept_admin" && membership.role !== "user") {
    return { status: "unavailable" };
  }

  return { status: "ready", role: membership.role };
}

export async function redirectToRoleHome() {
  const access = await getDepartmentAccess();
  if (access.status === "signed_out") redirect("/login");
  if (access.status === "unavailable") redirect("/access-unavailable");
  redirect(landingPath(access.role));
}

export async function requireDepartmentRole(required: DepartmentRole) {
  const access = await getDepartmentAccess();
  if (access.status === "signed_out") redirect("/login");
  if (access.status === "unavailable") redirect("/access-unavailable");
  if (access.role !== required) redirect(landingPath(access.role));
}
