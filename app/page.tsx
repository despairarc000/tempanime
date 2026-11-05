import { redirectToRoleHome } from "@/lib/auth/access";

export default async function RootPage() {
  await redirectToRoleHome();
}
