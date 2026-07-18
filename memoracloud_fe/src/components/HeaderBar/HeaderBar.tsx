"use client";

import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Layout, Avatar, Space, Breadcrumb, Button, Dropdown, App, message } from "antd";
import type { MenuProps } from "antd";
import { MenuOutlined, UserOutlined, LogoutOutlined, KeyOutlined } from "@ant-design/icons";
import { useBreadcrumbStore } from "@/store/breadcrumb.store";
import { useLogout } from "@/hooks/useLogout";
import { RouteConfig } from "@/utils/routeConfig";
import { DynamicFormModal } from "@/components";
import type { FormField } from "@/types/components/DynamicFormModal.types";
import styles from "./HeaderBar.module.css";

const { Header } = Layout;

// Helper to find the matched breadcrumb trail
const findBreadcrumbTrail = (
  items: any[],
  currentPath: string
): any[] => {
  let bestMatch: any[] = [];
  let maxLen = 0;

  const traverse = (data: any[], currentTrail: any[]) => {
    for (const item of data) {
      if (!item) continue;
      
      const newTrail = [...currentTrail, item];
      const keyStr = item.key?.toString() || "";
      
      // Match exact path or dynamic child route (e.g., /user-management/123)
      if (
        (currentPath === keyStr || currentPath.startsWith(`${keyStr}/`)) &&
        keyStr.length > maxLen
      ) {
        maxLen = keyStr.length;
        bestMatch = newTrail;
      }

      if (item.children) {
        traverse(item.children, newTrail);
      }
    }
  };

  traverse(items, []);
  return bestMatch;
};

// Helper to extract text from ReactNode if it's a Link
const extractLabel = (label: any): string => {
  if (typeof label === "string") return label;
  if (label && label.props && typeof label.props.children === "string") {
    return label.props.children;
  }
  return "Page"; // fallback
};

export default function HeaderBar({ 
  menuItems = [],
  isMobile = false,
  onMenuClick
}: { 
  menuItems?: any[];
  isMobile?: boolean;
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const dynamicTitle = useBreadcrumbStore((state) => state.dynamicTitle);
  const { logout } = useLogout();
  const { modal } = App.useApp();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const passwordFormFields: FormField[] = [
    {
      name: "currentPassword",
      label: "Current Password",
      type: "password",
      required: true,
      placeholder: "Enter your current password",
      fullWidth: true,
      extra: "Enter your current password to continue",
    },
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      required: true,
      placeholder: "Enter your new password",
      fullWidth: true,
      showStrengthMeter: true,
      extra: "Password must be at least 8 characters long and include a combination of letters, numbers & symbols",
      rules: [
        { required: true, message: "Please enter your new password" },
        { min: 8, message: "Password must be at least 8 characters long" },
        {
          pattern: /[A-Za-z]/,
          message: "Password must include at least one letter",
        },
        {
          pattern: /\d/,
          message: "Password must include at least one number",
        },
        {
          pattern: /[^A-Za-z0-9]/,
          message: "Password must include at least one symbol",
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || value !== getFieldValue("currentPassword")) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error("New password must be different from current password")
            );
          },
        }),
      ]
    },
    {
      name: "confirmPassword",
      label: "Confirm New Password",
      type: "password",
      required: true,
      placeholder: "Confirm your new password",
      fullWidth: true,
      extra: "Re-enter your new password to confirm",
      rules: [
        { required: true, message: "Please confirm your new password" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("newPassword") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Passwords do not match"));
          },
        }),
      ]
    },
  ];

  const handlePasswordSubmit = (values: any) => {
    console.log("Password changed", values);
    setIsPasswordModalOpen(false);
    message.success("Password updated successfully");
  };

  const profileMenu: MenuProps = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: <Link href="/profile">Profile</Link>,
      },
      {
        type: "divider",
      },
      {
        key: "changePassword",
        icon: <KeyOutlined />,
        label: "Change Password",
        onClick: () => setIsPasswordModalOpen(true),
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        danger: true,
        label: "Logout",
        onClick: () => {
          modal.confirm({
            title: "Logout",
            content: "Are you sure you want to logout?",
            okText: "Logout",
            okType: "danger",
            cancelText: "Cancel",
            centered: true,
            onOk: logout,
          });
        },
      },
    ],
  };

  const breadcrumbTrail = useMemo(() => {
    const baseTrail = findBreadcrumbTrail(menuItems, pathname);
    if (baseTrail.length === 0) return baseTrail;

    const matchedKey = baseTrail[baseTrail.length - 1].key;
    
    // If the current path is deeper than the matched config, it's a dynamic route
    if (pathname !== matchedKey) {
      // Append the dynamic page as the final leaf in the breadcrumb
      return [
        ...baseTrail,
        {
          key: pathname,
          label: dynamicTitle || "Details",
        },
      ];
    }
    return baseTrail;
  }, [pathname, dynamicTitle, menuItems]);

  const currentPageTitle = breadcrumbTrail.length > 0
    ? extractLabel(breadcrumbTrail[breadcrumbTrail.length - 1].label)
    : "Dashboard";

  // Map to Ant Design's expected item format
  const breadcrumbItems = breadcrumbTrail.map((item) => ({
    title: extractLabel(item.label),
    href: item.key, // Passing href so itemRender can use it
  }));

  // Official Ant Design way to integrate with React/Next.js routers
  const itemRender = (currentRoute: any, params: any, items: any[], paths: string[]) => {
    const isLast = currentRoute?.href === items[items.length - 1]?.href;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link href={currentRoute.href}>{currentRoute.title}</Link>
    );
  };

  return (
    <Header className={styles.header}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={onMenuClick}
              style={{ fontSize: '18px', marginRight: '12px', marginLeft: '-4px' }}
            />
          )}
          <div style={{ display: "inline-block", verticalAlign: "middle" }}>
            {breadcrumbItems.length > 0 && (
              <Breadcrumb 
                items={breadcrumbItems} 
                itemRender={itemRender}
                style={{ marginBottom: 4 }} 
              />
            )}
            <h2 style={{ margin: 0, fontSize: "1.25rem", lineHeight: 1 }}>
              {currentPageTitle}
            </h2>
          </div>
        </div>

        <Dropdown menu={profileMenu} trigger={["click"]} placement="bottomRight">
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>Quadricx</span>
              <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>Administrator</span>
            </div>
            <Avatar size={40} style={{ backgroundColor: "#2b7cff", color: "white", fontWeight: "bold" }}>Q</Avatar>
          </div>
        </Dropdown>
      </div>

      <DynamicFormModal
        title="Change Password"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        fields={passwordFormFields}
        submitText="Update Password"
      />
    </Header>
  );
}
