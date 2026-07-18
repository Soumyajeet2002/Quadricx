import apiServer from "@/service/axios-server";
import { RouteConfig } from "@/utils/routeConfig";
import { App } from "antd";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const logout = async () => {
    try {
      const result = await apiServer.get("/api/auth/logout");

      if (result.data.status === 200) {
        message.success(result.data.message);
        router.push(RouteConfig.MAIN_ROUTE);
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Logout failed. Please try again.",
      );
    }
  };

  return { logout };
};
