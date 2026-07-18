"use client";

import React, { useState, use } from "react";
import { Tabs, Typography, Tag, Button } from "antd";
import { ArrowLeftOutlined, LinkOutlined, SettingOutlined, CloudUploadOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AlbumsView from "./components/AlbumsView";
import UploadCenterView from "./components/UploadCenterView";
import styles from "./page.module.css";

const { Title, Text } = Typography;

export default function SingleProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("albums");

  // Mock project data
  const project = {
    id: id,
    name: "Rahul & Priya Wedding",
    client: "Rahul Sharma",
    date: "12 May 2024",
    status: "In Progress",
    storageUsed: "45 GB",
    mediaCount: "1200 Photos, 5 Videos"
  };

  const items = [
    {
      key: "albums",
      label: (
        <span>
          <FolderOpenOutlined />
          Albums
        </span>
      ),
      children: <AlbumsView projectId={project.id} />,
    },
    {
      key: "upload",
      label: (
        <span>
          <CloudUploadOutlined />
          Upload Center
        </span>
      ),
      children: <UploadCenterView projectId={project.id} />,
    },
    {
      key: "share",
      label: (
        <span>
          <LinkOutlined />
          Share Links
        </span>
      ),
      children: <div className={styles.placeholderTab}>Share Links Settings (Coming Soon)</div>,
    },
    {
      key: "settings",
      label: (
        <span>
          <SettingOutlined />
          Settings
        </span>
      ),
      children: <div className={styles.placeholderTab}>Project Settings (Coming Soon)</div>,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push("/projects")}
          className={styles.backBtn}
        >
          Back to Projects
        </Button>
      </div>

      {/* Project Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <Title level={2} className={styles.projectTitle}>{project.name}</Title>
          <Tag className={styles.statusTag} color="blue">{project.status}</Tag>
        </div>
        <div className={styles.headerMeta}>
          <Text className={styles.metaText}>Client: {project.client}</Text>
          <Text className={styles.metaText}>Date: {project.date}</Text>
          <Text className={styles.metaText}>Storage: {project.storageUsed}</Text>
          <Text className={styles.metaText}>{project.mediaCount}</Text>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className={styles.tabs}
        size="large"
      />
    </div>
  );
}
