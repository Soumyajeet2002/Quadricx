"use client";

import React, { useState } from "react";
import { 
  Typography, 
  Button, 
  Input, 
  Dropdown, 
  MenuProps,
  Avatar
} from "antd";
import { 
  PlusOutlined, 
  MoreOutlined,
  UserOutlined
} from "@ant-design/icons";
import { DynamicFormModal } from "@/components";
import type { FormField } from "@/types/components/DynamicFormModal.types";
import styles from "./page.module.css";

const { Title, Text } = Typography;
const { Search } = Input;

// Mock Data
const MOCK_CLIENTS = [
  {
    id: "c1",
    fullName: "Rahul Sharma",
    email: "rahul@email.com",
    phone: "+91 9876543210",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    projectsCount: 4,
  },
  {
    id: "c2",
    fullName: "Ankit Verma",
    email: "ankit@email.com",
    phone: "+91 123456789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit",
    projectsCount: 2,
  },
  {
    id: "c3",
    fullName: "Sneha Kapoor",
    email: "sneha@email.com",
    phone: "+91 998776655",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    projectsCount: 1,
  },
  {
    id: "c4",
    fullName: "Rohan Mehta",
    email: "rohan@email.com",
    phone: "+91 9876509844",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
    projectsCount: 3,
  }
];

export default function ClientsPage() {
  const [clients] = useState(MOCK_CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clientFormFields: FormField[] = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter full name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "text",
      required: true,
      placeholder: "Enter email",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "Enter phone number",
    }
  ];

  const handleCreateClient = (values: any) => {
    console.log("New Client Values:", values);
    setIsModalOpen(false);
  };

  const clientMenu: MenuProps = {
    items: [
      { key: 'edit', label: 'Edit Client' },
      { type: 'divider' },
      { key: 'delete', label: 'Delete', danger: true },
    ]
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Title level={3} className={styles.pageTitle}>Clients</Title>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className={styles.newClientBtn} 
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Add Client
        </Button>
      </div>

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <Search 
          placeholder="Search clients..." 
          allowClear 
          style={{ maxWidth: 320 }} 
          size="large"
          className={styles.searchBar}
        />
      </div>

      {/* Clients List */}
      <div className={styles.clientList}>
        {clients.map((client) => (
          <div key={client.id} className={styles.clientRow}>
            {/* Avatar */}
            <div className={styles.avatarWrapper}>
              <Avatar 
                src={client.avatar} 
                icon={<UserOutlined />} 
                size={48} 
                style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
              />
            </div>

            {/* Info */}
            <div className={styles.clientInfo}>
              <Title level={5} className={styles.clientName}>{client.fullName}</Title>
              <Text className={styles.clientMeta}>
                <span className={styles.metaItem}>{client.email}</span>
                <span className={styles.metaDot}>•</span>
                <span className={styles.metaItem}>{client.phone}</span>
              </Text>
            </div>

            {/* Projects Count & Actions */}
            <div className={styles.clientActions}>
              <span className={styles.projectsCount}>
                {client.projectsCount} {client.projectsCount === 1 ? 'Project' : 'Projects'}
              </span>
              
              <Dropdown menu={clientMenu} trigger={['click']} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
              </Dropdown>
            </div>
          </div>
        ))}
      </div>

      <DynamicFormModal 
        title="Add New Client"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateClient}
        fields={clientFormFields}
        submitText="Save"
      />
    </div>
  );
}
