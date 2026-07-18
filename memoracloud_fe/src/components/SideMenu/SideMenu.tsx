"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import styles from "./SideMenu.module.css";
import { RouteConfig } from "@/utils/routeConfig";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface SideMenuProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  menuItems: MenuProps["items"];
  isMobile?: boolean;
}

export default function SideMenu({
  collapsed,
  setCollapsed,
  menuItems,
  isMobile = false,
}: SideMenuProps) {
  const pathname = usePathname();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    // Helper to find the matching item and its parent keys for nested menus
    const findMatchingKeys = (
      itemsList: any[],
      currentPath: string,
    ): { selected: string | null; parents: string[] } => {
      let bestMatch: string | null = null;
      let parents: string[] = [];
      let maxLen = 0;

      const traverse = (data: any[], parentChain: string[]) => {
        for (const item of data) {
          if (!item) continue;

          if (item.key) {
            const keyStr = item.key.toString();
            // Match exact path or dynamic child route (e.g., /user-management/123)
            if (
              (currentPath === keyStr ||
                currentPath.startsWith(`${keyStr}/`)) &&
              keyStr.length > maxLen
            ) {
              maxLen = keyStr.length;
              bestMatch = keyStr;
              parents = [...parentChain];
            }
          }

          if (item.children) {
            traverse(
              item.children,
              item.key ? [...parentChain, item.key.toString()] : parentChain,
            );
          }
        }
      };

      traverse(itemsList, []);
      return { selected: bestMatch, parents };
    };

    const { selected, parents } = findMatchingKeys(menuItems || [], pathname);

    if (selected) {
      setSelectedKeys([selected]);
      // Only add to openKeys, maintaining any user-toggled menus
      setOpenKeys((prev) => Array.from(new Set([...prev, ...parents])));
    } else {
      setSelectedKeys([]);
    }
  }, [pathname]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      collapsible={!isMobile}
      collapsed={isMobile ? false : collapsed}
      trigger={null}
      width={260}
      collapsedWidth={80}
      className={isMobile ? styles.sidebarMobile : styles.sidebar}
      theme="dark"
    >
      <div className={styles.logoContainer}>
        <div className={styles.logo}>{(collapsed && !isMobile) ? "EG" : "Event Gallery"}</div>

        {!isMobile && (
          <Button
            style={{ color: "white" }}
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseBtn}
          />
        )}
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menuItems}
        className={styles.menu}
      />
    </Sider>
  );
}
