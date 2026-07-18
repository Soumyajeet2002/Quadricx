"use client";

import { FooterBar, HeaderBar, SideMenu } from "@/components";
import Link from "next/link";
import {
  DashboardOutlined,
  FolderOpenOutlined,
  TeamOutlined,
  PictureOutlined,
  ShoppingOutlined,
  CheckSquareOutlined,
  SendOutlined,
  LineChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Grid, Drawer } from "antd";
import { useState, useEffect } from "react";
import styles from "../Layout.module.css";

const { Content } = Layout;
const { useBreakpoint } = Grid;

// Defined outside component so it is never re-created on re-renders
const orgMenuItems = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "/projects",
    icon: <FolderOpenOutlined />,
    label: <Link href="/projects">Projects</Link>,
  },
  {
    key: "/clients",
    icon: <TeamOutlined />,
    label: <Link href="/clients">Clients</Link>,
  },
  {
    key: "/gallery",
    icon: <PictureOutlined />,
    label: <Link href="/gallery">Gallery</Link>,
  },
  {
    key: "/orders",
    icon: <ShoppingOutlined />,
    label: <Link href="/orders">Orders</Link>,
  },
  {
    key: "/approvals",
    icon: <CheckSquareOutlined />,
    label: <Link href="/approvals">Album Approvals</Link>,
  },
  {
    key: "/deliveries",
    icon: <SendOutlined />,
    label: <Link href="/deliveries">Deliveries</Link>,
  },
  {
    key: "/analytics",
    icon: <LineChartOutlined />,
    label: <Link href="/analytics">Analytics</Link>,
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: <Link href="/settings">Settings</Link>,
  },
];

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const screens = useBreakpoint();

  const isMobile = screens.lg === false;

  // Auto close drawer when returning to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  return (
    <Layout className={styles.layout}>
      {!isMobile && (
        <SideMenu
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          menuItems={orgMenuItems}
        />
      )}

      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen && isMobile}
        styles={{ body: { padding: 0, background: "#001529" } }}
        size={260}
      >
        <SideMenu
          collapsed={false}
          setCollapsed={() => {}}
          menuItems={orgMenuItems}
          isMobile={true}
        />
      </Drawer>

      <Layout
        className={styles.mainLayout}
        style={
          {
            marginLeft: isMobile ? 0 : collapsed ? 80 : 260,
            transition: "margin-left 0.2s",
            "--sidebar-width": isMobile ? "0px" : collapsed ? "80px" : "260px",
          } as React.CSSProperties
        }
      >
        <HeaderBar
          menuItems={orgMenuItems}
          isMobile={isMobile}
          onMenuClick={() => setMobileDrawerOpen(true)}
        />

        <Content className={styles.content}>
          <div className={styles.page}>{children}</div>
        </Content>

        <FooterBar />
      </Layout>
    </Layout>
  );
};

export default OrganizationLayout;
