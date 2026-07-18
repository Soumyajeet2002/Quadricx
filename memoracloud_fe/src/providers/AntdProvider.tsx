"use client";

import { ConfigProvider, theme, App } from "antd";
import { ReactNode } from "react";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,

        token: {
          // Brand Color
          colorPrimary: "#722ed1",

          // Layout
          colorBgLayout: "#F7F8FC",
          colorBgContainer: "#FFFFFF",

          // Border
          colorBorder: "#E5E7EB",

          // Text
          colorText: "#1F2937",

          // Radius
          borderRadius: 8,

          // Font
          fontFamily: "var(--font-signika)",
        },

        components: {
          Button: {
            colorPrimary: "#722ed1",
            colorPrimaryHover: "#7E6BFF",
            colorPrimaryActive: "#5A4FD6",
          },

          Input: {
            activeBorderColor: "#722ed1",
            hoverBorderColor: "#722ed1",
          },

          Table: {
            headerBg: "#722ed1",
            headerColor: "#ffffff",
            headerSortActiveBg: "#5b21b6",
            headerSortHoverBg: "#6d28d9",
          },

          Pagination: {
            colorPrimary: "#722ed1",
          },

          Menu: {
            itemSelectedBg: "#EDE9FE",
            itemSelectedColor: "#722ed1",
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
