import { requireDepartmentRole } from "@/lib/auth/access";

export default async function UserHomePage() {
  await requireDepartmentRole("user");
  return <main className="min-h-screen" aria-label="User home" />;
}
