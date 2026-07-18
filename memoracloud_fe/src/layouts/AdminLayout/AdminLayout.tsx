"use client";

import { FooterBar, HeaderBar, SideMenu } from "@/components";
import Link from "next/link";
import {
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Layout, Grid, Drawer } from "antd";
import { useState, useEffect } from "react";
import styles from "../Layout.module.css";

const { Content } = Layout;
const { useBreakpoint } = Grid;

// Defined outside component so it is never re-created on re-renders
const adminMenuItems = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "/user-management",
    icon: <UserOutlined />,
    label: <Link href="/user-management">User Management</Link>,
  },
  {
    key: "/project-management",
    icon: <ProjectOutlined />,
    label: "Project Management",
    children: [
      {
        key: "/project-management/project-allocation",
        label: (
          <Link href="/project-management/project-allocation">
            Project Allocation
          </Link>
        ),
      },
    ],
  },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
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
          menuItems={adminMenuItems}
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
          menuItems={adminMenuItems}
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
          menuItems={adminMenuItems}
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

export default AdminLayout;
