import { requireDepartmentRole } from "@/lib/auth/access";

export default async function AdminHomePage() {
  await requireDepartmentRole("dept_admin");
  return <main className="min-h-screen" aria-label="Department admin home" />;
}
