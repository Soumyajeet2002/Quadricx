"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  App,
  Avatar,
  Button,
  Space,
  Select,
  Tag,
  Card,
  Typography,
  Progress,
  Input,
  Dropdown,
  Row,
  Col,
} from "antd";

import {
  CheckOutlined,
  CloseOutlined,
  DatabaseOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  EnvironmentOutlined,
  MailOutlined,
  CalendarOutlined,
  FolderOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { DataTable } from "@/components";

const { Text } = Typography;

interface ProjectAllocation {
  id: string;
  client: string;
  email: string;
  city: string;
  project: string;
  projectDate: string;
  storageUsed: number; // GB
  storageTotal: number; // GB
  paymentStatus: "Paid" | "Pending" | "Failed";
  amount: number;
  paymentNote: string;
  status: "Pending" | "Approved" | "Rejected";
  statusNote: string;
}

interface Organisation {
  value: string;
  label: string;
  location: string;
  totalProjects: number;
  totalStorage: string;
}

type ProjectStatus = "Pending" | "Approved" | "Rejected";

const statusConfig: Record<ProjectStatus, { color: string; icon: ReactNode }> =
  {
    Pending: { color: "orange", icon: <ClockCircleOutlined /> },
    Approved: { color: "green", icon: <CheckCircleOutlined /> },
    Rejected: { color: "red", icon: <CloseCircleOutlined /> },
  };

const organisations: Organisation[] = [
  {
    value: "dream",
    label: "Dream Lens Studio",
    location: "Bhubaneswar, Odisha",
    totalProjects: 45,
    totalStorage: "500 GB",
  },
  {
    value: "pixel",
    label: "Pixel Perfect Studio",
    location: "Cuttack, Odisha",
    totalProjects: 28,
    totalStorage: "300 GB",
  },
  {
    value: "royal",
    label: "Royal Clicks",
    location: "Puri, Odisha",
    totalProjects: 60,
    totalStorage: "750 GB",
  },
];

const projectData: ProjectAllocation[] = [
  {
    id: "1",
    client: "Ankit Sharma",
    email: "ankit.sharma@gmail.com",
    city: "Bhubaneswar, Odisha",
    project: "Wedding",
    projectDate: "12 May 2024",
    storageUsed: 25,
    storageTotal: 100,
    paymentStatus: "Paid",
    amount: 5000,
    paymentNote: "Paid on 10 May 2024",
    status: "Pending",
    statusNote: "Waiting for approval",
  },
  {
    id: "2",
    client: "Priya Patel",
    email: "priya.patel@yahoo.com",
    city: "Cuttack, Odisha",
    project: "Mehendi",
    projectDate: "18 May 2024",
    storageUsed: 50,
    storageTotal: 100,
    paymentStatus: "Pending",
    amount: 8000,
    paymentNote: "Payment pending",
    status: "Pending",
    statusNote: "Waiting for approval",
  },
  {
    id: "3",
    client: "Rakesh Sahoo",
    email: "rakesh.sahoo@gmail.com",
    city: "Puri, Odisha",
    project: "Reception",
    projectDate: "22 Apr 2024",
    storageUsed: 70,
    storageTotal: 100,
    paymentStatus: "Paid",
    amount: 12000,
    paymentNote: "Paid on 20 Apr 2024",
    status: "Approved",
    statusNote: "Approved on 22 Apr 2024",
  },
  {
    id: "4",
    client: "Swati Mohanty",
    email: "swati.mohanty@gmail.com",
    city: "Bhubaneswar, Odisha",
    project: "Birthday",
    projectDate: "05 May 2024",
    storageUsed: 20,
    storageTotal: 100,
    paymentStatus: "Failed",
    amount: 3000,
    paymentNote: "Payment failed",
    status: "Rejected",
    statusNote: "Rejected on 06 May 2024",
  },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((item) => item[0])
    .join("");

const avatarColors = ["#7c3aed", "#0d9488", "#db2777", "#ea580c"];

export default function ProjectAllocationPage() {
  const { message } = App.useApp();

  const [organisation, setOrganisation] = useState<string>("dream");
  const [data, setData] = useState<ProjectAllocation[]>(projectData);
  const [searchText, setSearchText] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [approvalFilter, setApprovalFilter] = useState<string>("All");

  const selectedOrg = organisations.find((o) => o.value === organisation);

  const handleApprove = (record: ProjectAllocation) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, status: "Approved" } : item,
      ),
    );
    message.success("Project approved successfully");
  };

  const handleReject = (record: ProjectAllocation) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, status: "Rejected" } : item,
      ),
    );
    message.error("Project rejected");
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.client.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.city.toLowerCase().includes(searchText.toLowerCase());

      const matchesPayment =
        paymentFilter === "All" || item.paymentStatus === paymentFilter;

      const matchesApproval =
        approvalFilter === "All" || item.status === approvalFilter;

      return matchesSearch && matchesPayment && matchesApproval;
    });
  }, [data, searchText, paymentFilter, approvalFilter]);

  const stats = useMemo(() => {
    const totalProjects = data.length;
    const pending = data.filter((d) => d.status === "Pending").length;
    const approved = data.filter((d) => d.status === "Approved").length;
    const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
    return { totalProjects, pending, approved, totalAmount };
  }, [data]);

  const columns: ColumnsType<ProjectAllocation> = [
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      width: 240,
      render: (name, record) => (
        <Space align="start">
          <Avatar
            style={{
              background:
                avatarColors[parseInt(record.id, 10) % avatarColors.length],
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(name)}
          </Avatar>
          <div>
            <Text strong style={{ display: "block" }}>
              {name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.city}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Project Details",
      dataIndex: "project",
      key: "project",
      width: 160,
      render: (value, record) => (
        <Space direction="vertical" size={4}>
          <Tag color="purple">{value}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {record.projectDate}
          </Text>
        </Space>
      ),
    },
    {
      title: "Storage Allocation",
      dataIndex: "storageUsed",
      key: "storage",
      width: 200,
      render: (_, record) => {
        const percent = Math.round(
          (record.storageUsed / record.storageTotal) * 100,
        );
        return (
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>
              {record.storageUsed} GB / {record.storageTotal} GB
            </Text>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              strokeColor="#7c3aed"
              style={{ marginTop: 4, marginBottom: 2 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {percent}% Used
            </Text>
          </div>
        );
      },
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 160,
      render: (status, record) => (
        <div>
          <Tag
            color={
              status === "Paid"
                ? "green"
                : status === "Pending"
                  ? "orange"
                  : "red"
            }
          >
            {status}
          </Tag>
          <Text strong style={{ display: "block", marginTop: 4 }}>
            ₹ {record.amount.toLocaleString("en-IN")}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.paymentNote}
          </Text>
        </div>
      ),
    },
    {
      title: "Approval Status",
      dataIndex: "status",
      key: "status",
      width: 190,
      render: (status, record) => {
        const config = statusConfig[record.status];

        return (
          <div>
            <Tag color={config.color} icon={config.icon}>
              {record.status}
            </Tag>
            <Text
              type="secondary"
              style={{ fontSize: 12, display: "block", marginTop: 4 }}
            >
              {record.statusNote}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 70,
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "approve",
            label: "Approve",
            icon: <CheckOutlined />,
            disabled: record.status === "Approved",
            onClick: () => handleApprove(record),
          },
          {
            key: "reject",
            label: "Reject",
            icon: <CloseOutlined />,
            danger: true,
            disabled: record.status === "Rejected",
            onClick: () => handleReject(record),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      {/* Organisation summary bar */}
      <Card variant="borderless" style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col flex="auto">
            <Space align="start" size={16}>
              <Avatar
                shape="square"
                size={48}
                style={{
                  background: "#7c3aed",
                  borderRadius: 10,
                }}
                icon={<AppstoreOutlined />}
              />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Selected Organisation
                </Text>
                <Typography.Title level={5} style={{ margin: "2px 0 8px" }}>
                  {selectedOrg?.label}
                </Typography.Title>
                <Space size={24}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <EnvironmentOutlined style={{ marginRight: 6 }} />
                    {selectedOrg?.location}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <FolderOutlined style={{ marginRight: 6 }} />
                    {selectedOrg?.totalProjects} Total Projects
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <DatabaseOutlined style={{ marginRight: 6 }} />
                    {selectedOrg?.totalStorage} Total Storage
                  </Text>
                </Space>
              </div>
            </Space>
          </Col>
          <Col>
            <div style={{ marginBottom: 6 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Select Organisation
              </Text>
            </div>
            <Select
              style={{ width: 260 }}
              options={organisations.map((o) => ({
                label: o.label,
                value: o.value,
              }))}
              value={organisation}
              onChange={(value) => {
                setOrganisation(value);
                // API call here — load client project list for this org
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* Stat cards */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card variant="borderless">
            <Space align="start">
              <Avatar
                shape="square"
                style={{
                  background: "#f3e8ff",
                  color: "#7c3aed",
                  borderRadius: 10,
                }}
                icon={<FolderOutlined />}
              />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total Projects
                </Text>
                <Typography.Title level={4} style={{ margin: "2px 0" }}>
                  {stats.totalProjects}
                </Typography.Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  All time projects
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Space align="start">
              <Avatar
                shape="square"
                style={{
                  background: "#fff7e6",
                  color: "#fa8c16",
                  borderRadius: 10,
                }}
                icon={<ClockCircleOutlined />}
              />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Pending Approval
                </Text>
                <Typography.Title level={4} style={{ margin: "2px 0" }}>
                  {stats.pending}
                </Typography.Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Waiting for approval
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Space align="start">
              <Avatar
                shape="square"
                style={{
                  background: "#f6ffed",
                  color: "#52c41a",
                  borderRadius: 10,
                }}
                icon={<CheckCircleOutlined />}
              />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Approved Projects
                </Text>
                <Typography.Title level={4} style={{ margin: "2px 0" }}>
                  {stats.approved}
                </Typography.Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Successfully approved
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Space align="start">
              <Avatar
                shape="square"
                style={{
                  background: "#e6f4ff",
                  color: "#1677ff",
                  borderRadius: 10,
                }}
                icon={<DollarOutlined />}
              />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total Amount
                </Text>
                <Typography.Title level={4} style={{ margin: "2px 0" }}>
                  ₹ {stats.totalAmount.toLocaleString("en-IN")}
                </Typography.Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total revenue
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Search and filters */}
      <Card variant="borderless" style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Search by client name, email or city..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Space>
              <Text type="secondary">Payment Status</Text>
              <Select
                style={{ width: 120 }}
                value={paymentFilter}
                onChange={setPaymentFilter}
                options={[
                  { label: "All", value: "All" },
                  { label: "Paid", value: "Paid" },
                  { label: "Pending", value: "Pending" },
                  { label: "Failed", value: "Failed" },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Text type="secondary">Approval Status</Text>
              <Select
                style={{ width: 120 }}
                value={approvalFilter}
                onChange={setApprovalFilter}
                options={[
                  { label: "All", value: "All" },
                  { label: "Pending", value: "Pending" },
                  { label: "Approved", value: "Approved" },
                  { label: "Rejected", value: "Rejected" },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Button icon={<FilterOutlined />}>Filter</Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <DataTable<ProjectAllocation>
        columns={columns}
        data={filteredData}
        rowKey="id"
        searchableKeys={["client", "project"]}
        pageSize={10}
      />
    </>
  );
}
