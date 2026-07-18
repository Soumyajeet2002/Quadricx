import { redirect } from "next/navigation";
import { RouteConfig } from "@/utils/routeConfig";

export default function HomePage() {
  redirect(RouteConfig.LOGIN_PAGE);
}
