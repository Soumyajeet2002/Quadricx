"use client";

import React, { useState } from "react";
import { 
  Typography, 
  Button, 
  Input, 
  Select, 
  Dropdown, 
  Tag,
  MenuProps,
  Divider,
  Space,
  Avatar
} from "antd";
import { 
  PlusOutlined, 
  FilterOutlined, 
  MoreOutlined,
  PictureOutlined,
  UserOutlined
} from "@ant-design/icons";
import { DynamicFormModal } from "@/components";
import type { FormField } from "@/types/components/DynamicFormModal.types";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const { Title, Text } = Typography;
const { Search } = Input;

// Mock Data
const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Rahul & Priya Wedding",
    date: "12 May 2024",
    mediaCount: "1200 Photos, 5 Videos",
    status: "In Progress",
    thumbnail: null // Placeholder for image
  },
  {
    id: "2",
    name: "Ankit Birthday Party",
    date: "10 May 2024",
    mediaCount: "800 Photos, 2 Videos",
    status: "In Progress",
    thumbnail: null
  },
  {
    id: "3",
    name: "Sneha Baby Shower",
    date: "08 May 2024",
    mediaCount: "650 Photos, 3 Videos",
    status: "Completed",
    thumbnail: null
  },
  {
    id: "4",
    name: "Rohan Engagement",
    date: "05 May 2024",
    mediaCount: "950 Photos, 4 Videos",
    status: "Pending Approval",
    thumbnail: null
  },
];

export default function ProjectsPage() {
  const [projects] = useState(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCreateClientClick = () => {
    console.log("Create Client Flow Triggered");
    // TODO: Open Create Client Modal
  };

  const projectFormFields: FormField[] = [
    {
      name: "projectName",
      label: "Project Name",
      type: "text",
      required: true,
      placeholder: "e.g., Rahul & Priya Wedding",
      maxLength: 100,
    },
    {
      name: "projectType",
      label: "Project Type",
      type: "select",
      required: true,
      placeholder: "Select event type",
      options: [
        { label: "Wedding", value: "wedding" },
        { label: "Pre-Wedding", value: "pre_wedding" },
        { label: "Birthday", value: "birthday" },
        { label: "Baby Shower", value: "baby_shower" },
        { label: "Corporate Event", value: "corporate" },
      ]
    },
    {
      name: "client",
      label: "Client",
      type: "select",
      required: true,
      placeholder: "Select client",
      showSearch: true,
      options: [
        { 
          label: "Rahul Sharma", 
          value: "c1", 
          email: "rahul@example.com", 
          phone: "+91 98765 43210",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" 
        },
        { 
          label: "Ankit Verma", 
          value: "c2", 
          email: "ankit.v@example.com", 
          phone: "+91 91234 56789",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit" 
        },
      ],
      optionRender: (option) => (
        <Space align="start" style={{ padding: '4px 0' }}>
          <Avatar 
            src={option.data.avatar} 
            icon={<UserOutlined />} 
            size="large" 
            style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 500, color: '#1e293b' }}>{option.data.label}</span>
            <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              {option.data.email} • {option.data.phone}
            </span>
          </div>
        </Space>
      ),
      dropdownRender: (menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Button type="link" icon={<PlusOutlined />} onClick={handleCreateClientClick} style={{ fontWeight: 500, paddingLeft: 0 }}>
              Add new client
            </Button>
          </Space>
        </>
      )
    },
    {
      name: "eventDate",
      label: "Date of Event",
      type: "date",
      required: true,
    },
    {
      name: "venue",
      label: "Venue",
      type: "text",
      placeholder: "e.g., Taj Hotel, Mumbai",
    },
    {
      name: "thumbnail",
      label: "Event Thumbnail (Optional)",
      type: "upload",
      required: false,
    },
    {
      name: "description",
      label: "Notes / Description",
      type: "textarea",
      placeholder: "Any special instructions or notes...",
      maxLength: 500,
    }
  ];

  const handleCreateProject = (values: any) => {
    console.log("New Project Values:", values);
    setIsModalOpen(false);
  };

  const getStatusTag = (status: string) => {
    let cls = styles.tagSlate;
    if (status === "Completed") cls = styles.tagForest;
    if (status === "Pending Approval") cls = styles.tagClay;

    return <Tag className={`${styles.statusTag} ${cls}`}>{status}</Tag>;
  };

  const projectMenu: MenuProps = {
    items: [
      { key: 'edit', label: 'Edit Project' },
      { key: 'archive', label: 'Archive' },
      { type: 'divider' },
      { key: 'delete', label: 'Delete', danger: true },
    ]
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Title level={3} className={styles.pageTitle}>Projects</Title>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className={styles.newProjectBtn} 
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          New Project
        </Button>
      </div>

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <Search 
          placeholder="Search projects..." 
          allowClear 
          style={{ maxWidth: 320 }} 
          size="large"
          className={styles.searchBar}
        />
        <Select
          defaultValue="all"
          size="large"
          style={{ width: 160 }}
          className={styles.filterSelect}
          suffixIcon={<FilterOutlined />}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending Approval' },
          ]}
        />
      </div>

      {/* Projects List */}
      <div className={styles.projectList}>
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={styles.projectRow}
            onClick={() => router.push(`/projects/${project.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {/* Thumbnail */}
            <div className={styles.thumbnailWrapper}>
              {project.thumbnail ? (
                <img src={project.thumbnail} alt={project.name} className={styles.thumbnail} />
              ) : (
                <div className={styles.thumbnailPlaceholder}>
                  <PictureOutlined className={styles.placeholderIcon} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className={styles.projectInfo}>
              <Title level={5} className={styles.projectName}>{project.name}</Title>
              <Text className={styles.projectMeta}>
                <span className={styles.metaItem}>{project.date}</span>
                <span className={styles.metaDot}>•</span>
                <span className={styles.metaItem}>{project.mediaCount}</span>
              </Text>
            </div>

            {/* Status & Actions */}
            <div className={styles.projectActions} onClick={(e) => e.stopPropagation()}>
              {getStatusTag(project.status)}
              
              <Dropdown menu={projectMenu} trigger={['click']} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
              </Dropdown>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Load More */}
      <div className={styles.loadMoreWrapper}>
        <Button size="large" className={styles.loadMoreBtn}>
          Load More
        </Button>
      </div>

      <DynamicFormModal 
        title="Create New Project"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        fields={projectFormFields}
        submitText="Create Project"
      />
    </div>
  );
}
