import type { Metadata } from "next";
import localFont from "next/font/local";
import "antd/dist/reset.css";
import "./globals.css";
import AntdProvider from "@/providers/AntdProvider";
import PageTransitionProvider from "@/providers/PageTransitionProvider";
import AuthHydrator from "@/AuthHydrator";

const signikaNegative = localFont({
  src: [
    {
      path: "../public/fonts/SignikaNegative-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/SignikaNegative-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/SignikaNegative-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/SignikaNegative-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-signika",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MemoraCloud",
  description: "Cloud-based Photo & Video Gallery Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={signikaNegative.variable}>
      <body>
        <AuthHydrator>
          <PageTransitionProvider>
            <AntdProvider>{children}</AntdProvider>
          </PageTransitionProvider>
        </AuthHydrator>
      </body>
    </html>
  );
}
