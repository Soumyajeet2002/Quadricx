import { useEffect } from "react";
import { useBreadcrumbStore } from "@/store/breadcrumb.store";

export const useDynamicTitle = (title: string | null | undefined) => {
  const setDynamicTitle = useBreadcrumbStore((state) => state.setDynamicTitle);

  useEffect(() => {
    if (title) {
      setDynamicTitle(title);
    }
    return () => {
      setDynamicTitle(null);
    };
  }, [title, setDynamicTitle]);
};
