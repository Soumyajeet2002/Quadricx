import { redirect } from "next/navigation";
import { RouteConfig } from "@/utils/routeConfig";

export default function AuthPage() {
  redirect(RouteConfig.LOGIN_PAGE);
}
