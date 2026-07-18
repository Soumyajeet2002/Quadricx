"use client";

import { Card, Col, Row, Typography, Select, Tag, Button } from "antd";
import { DataTable } from "@/components";
import Link from "next/link";
import {
  ArrowRightOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileSyncOutlined,
} from "@ant-design/icons";
import styles from "./page.module.css";

const { Title, Text } = Typography;

const statCards = [
  { title: "Total Projects", value: "40", icon: <CameraOutlined />, tone: "ink" },
  { title: "In Progress", value: "18", icon: <ClockCircleOutlined />, tone: "slate" },
  { title: "Completed", value: "12", icon: <CheckCircleOutlined />, tone: "forest" },
  { title: "Pending Approval", value: "10", icon: <FileSyncOutlined />, tone: "clay" },
];

const recentProjectsColumns = [
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
  },
  {
    title: "Client",
    dataIndex: "client",
    key: "client",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date: string) => <span className={styles.mono}>{date}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      let cls = styles.tagSlate;
      if (status === "Completed") cls = styles.tagForest;
      if (status === "Pending Approval") cls = styles.tagClay;

      return <Tag className={`${styles.statusTag} ${cls}`}>{status}</Tag>;
    },
  },
];

const recentProjectsData = [
  {
    key: "1",
    project: "Rahul & Priya Wedding",
    client: "Rahul Sharma",
    date: "12 May 2024",
    status: "In Progress",
  },
  {
    key: "2",
    project: "Ankit Birthday Party",
    client: "Ankit Verma",
    date: "10 May 2024",
    status: "In Progress",
  },
  {
    key: "3",
    project: "Sneha Baby Shower",
    client: "Sneha Kapoor",
    date: "08 May 2024",
    status: "Completed",
  },
  {
    key: "4",
    project: "Rohan Engagement",
    client: "Rohan Mehta",
    date: "05 May 2024",
    status: "Pending Approval",
  },
];

export default function PhotographerDashboard() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerRow}>
        <div>
          <Text className={styles.eyebrow}>Studio Overview</Text>
          <Title level={3} className={styles.pageTitle}>
            Welcome back, John
          </Title>
        </div>
        <div>
          <Select
            defaultValue="this_month"
            className={styles.periodSelect}
            options={[
              { value: "this_month", label: "This Month" },
              { value: "last_month", label: "Last Month" },
              { value: "this_year", label: "This Year" },
            ]}
          />
        </div>
      </div>

      {/* Sprocket divider — signature element */}
      <div className={styles.sprocketRule} aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} className={styles.sprocketHole} />
        ))}
      </div>

      {/* Stat Cards Section */}
      <Row gutter={[20, 20]} className={styles.statsRow}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className={styles.statCard} variant="borderless">
              <div className={styles.statCardHeader}>
                <span className={`${styles.iconWrapper} ${styles["tone-" + stat.tone]}`}>
                  {stat.icon}
                </span>
              </div>
              <Title level={2} className={`${styles.statValue} ${styles.mono}`}>
                {stat.value}
              </Title>
              <Text className={styles.statTitle}>{stat.title}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Projects Section */}
      <div className={styles.recentProjectsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <Text className={styles.eyebrow}>Contact Sheet</Text>
            <Title level={4} className={styles.sectionTitle}>
              Recent Projects
            </Title>
          </div>
          <Link href="/projects">
            <Button type="link" size="small" className={styles.viewAllBtn}>
              View All <ArrowRightOutlined />
            </Button>
          </Link>
        </div>

        <Card variant="borderless" className={styles.tableCard}>
          <DataTable
            columns={recentProjectsColumns}
            data={recentProjectsData}
            rowKey="key"
            searchableKeys={["project", "client"]}
            pageSize={5}
          />
        </Card>
      </div>
    </div>
  );
}