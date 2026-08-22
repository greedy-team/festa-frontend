import { redirect } from "next/navigation";
import { ADMIN_HOME } from "@/constants/routes";

export default function AdminIndexPage() {
  redirect(ADMIN_HOME);
}
