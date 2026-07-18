"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Button,
  Space,
  Drawer,
  FloatButton,
  Form,
  Input,
  Select,
  Tag,
  Checkbox,
  Row,
  Col,
  Typography,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { DataTable, DialogBox } from "@/components";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import type { ColumnsType } from "antd/es/table";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

interface Customer {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  projects: string[];
  status: "Active" | "Inactive";
}

const projectOptions = [
  { label: "Wedding", value: "Wedding", color: "pink" },
  { label: "Brataghar", value: "Brataghar", color: "blue" },
  { label: "Mehendi", value: "Mehendi", color: "green" },
  { label: "Sangeet", value: "Sangeet", color: "purple" },
  { label: "Reception", value: "Reception", color: "orange" },
  { label: "Pre Wedding", value: "Pre Wedding", color: "magenta" },
  { label: "Anniversary", value: "Anniversary", color: "gold" },
  { label: "Birthday", value: "Birthday", color: "volcano" },
  { label: "Baby Shower", value: "Baby Shower", color: "cyan" },
  { label: "Other", value: "Other", color: "default" },
];

const projectColorMap: Record<string, string> = projectOptions.reduce(
  (acc, cur) => ({ ...acc, [cur.value]: cur.color }),
  {},
);

const customers: Customer[] = [
  {
    id: "1",
    customerName: "Ankit Sharma",
    phone: "9876543210",
    email: "ankit.sharma@gmail.com",
    address: "Bhubaneswar, Odisha",
    projects: ["Wedding"],
    status: "Active",
  },
  {
    id: "2",
    customerName: "Priya Patel",
    phone: "9123456789",
    email: "priya.patel@yahoo.com",
    address: "Cuttack, Odisha",
    projects: ["Mehendi", "Sangeet"],
    status: "Active",
  },
  {
    id: "3",
    customerName: "Rakesh Sahoo",
    phone: "9988776655",
    email: "rakesh.sahoo@gmail.com",
    address: "Puri, Odisha",
    projects: ["Wedding", "Reception"],
    status: "Active",
  },
  {
    id: "4",
    customerName: "Swati Mohanty",
    phone: "9432156789",
    email: "swati.mohanty@gmail.com",
    address: "Bhubaneswar, Odisha",
    projects: ["Brataghar"],
    status: "Inactive",
  },
  {
    id: "5",
    customerName: "Dinesh Kumar",
    phone: "9776655443",
    email: "dinesh.kumar@gmail.com",
    address: "Berhampur, Odisha",
    projects: ["Wedding", "Mehendi"],
    status: "Active",
  },
  {
    id: "6",
    customerName: "Neha Priyadarshini",
    phone: "8899776655",
    email: "neha.priya@gmail.com",
    address: "Rourkela, Odisha",
    projects: ["Anniversary"],
    status: "Inactive",
  },
  {
    id: "7",
    customerName: "Amit Behera",
    phone: "9696969696",
    email: "amit.behera@gmail.com",
    address: "Sambalpur, Odisha",
    projects: ["Brataghar", "Reception"],
    status: "Active",
  },
];

const avatarColors = [
  "#6d5bd0",
  "#06b6d4",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#22c55e",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const getAvatarColor = (index: number) =>
  avatarColors[index % avatarColors.length];

const ClientsPage = () => {
  // In a real app, you would pass the name fetched from your API (e.g., data.studioName)
  useDynamicTitle("Dream Lens Studio");

  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // ---- Filter states ----
  const [searchText, setSearchText] = useState("");
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [appliedFilters, setAppliedFilters] = useState({
    searchText: "",
    projectType: "All",
    status: "All",
  });

  const handleSearch = () => {
    setAppliedFilters({
      searchText,
      projectType: projectTypeFilter,
      status: statusFilter,
    });
  };

  const handleReset = () => {
    setSearchText("");
    setProjectTypeFilter("All");
    setStatusFilter("All");
    setAppliedFilters({
      searchText: "",
      projectType: "All",
      status: "All",
    });
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      !appliedFilters.searchText ||
      c.customerName
        .toLowerCase()
        .includes(appliedFilters.searchText.toLowerCase()) ||
      c.phone.includes(appliedFilters.searchText) ||
      c.email.toLowerCase().includes(appliedFilters.searchText.toLowerCase());

    const matchesProjectType =
      appliedFilters.projectType === "All" ||
      c.projects.includes(appliedFilters.projectType);

    const matchesStatus =
      appliedFilters.status === "All" || c.status === appliedFilters.status;

    return matchesSearch && matchesProjectType && matchesStatus;
  });

  const columns: ColumnsType<Customer> = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 220,
      render: (text, record, index) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: getAvatarColor(index),
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {getInitials(text)}
          </Avatar>

          {text}
        </Space>
      ),
    },
    {
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Projects",
      dataIndex: "projects",
      key: "projects",
      width: 220,
      render: (projects: string[]) => (
        <Space size={4} wrap>
          {projects.map((p) => (
            <Tag key={p} color={projectColorMap[p] ?? "default"}>
              {p}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: Customer["status"]) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 170,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>

          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Customer) => {
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Customer) => {
    console.log("Delete:", record);
  };

  return (
    <>
      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="Search by name, phone or email"
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ flex: 1 }}
          allowClear
        />

        <Space>
          <span style={{ color: "#8c8c8c", whiteSpace: "nowrap" }}>
            Project Type
          </span>
          <Select
            value={projectTypeFilter}
            onChange={setProjectTypeFilter}
            style={{ width: 150 }}
            options={[
              { label: "All", value: "All" },
              ...projectOptions.map((p) => ({
                label: p.label,
                value: p.value,
              })),
            ]}
          />
        </Space>

        <Space>
          <span style={{ color: "#8c8c8c", whiteSpace: "nowrap" }}>Status</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 130 }}
            options={[
              { label: "All", value: "All" },
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </Space>

        <Button onClick={handleReset}>Reset</Button>

        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <DataTable<Customer>
        columns={columns}
        data={filteredCustomers}
        rowKey="id"
        showSearch={false}
        pageSize={10}
      />

      <FloatButton
        icon={<UserAddOutlined />}
        type="primary"
        tooltip="Add Customer"
        onClick={() => {
          form.resetFields();
          setDrawerOpen(true);
        }}
      />

      <Drawer
        title={
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Add Customer
            </Typography.Title>

            <Typography.Text type="secondary">
              Enter customer details and assign project information.
            </Typography.Text>
          </div>
        }
        placement="right"
        size={650}
        open={drawerOpen}
        closeIcon={<CloseOutlined />}
        onClose={() => {
          form.resetFields();
          setDrawerOpen(false);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "Active", projects: [] }}
          onFinish={(values) => {
            console.log(values);

            // API Call Here

            form.resetFields();
            setDrawerOpen(false);
            setDialogOpen(true);
          }}
        >
          <Space.Compact block style={{ gap: 16 }}>
            <Form.Item
              label="Customer Name"
              name="customerName"
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Please enter customer name" },
              ]}
            >
              <Input placeholder="Enter customer name" />
            </Form.Item>

            <Form.Item
              label="Phone No"
              name="phone"
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Please enter phone number" },
                {
                  pattern: /^[6-9]\d{9}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              ]}
            >
              <Input placeholder="Enter phone number" maxLength={10} />
            </Form.Item>
          </Space.Compact>

          <Space.Compact block style={{ gap: 16 }}>
            <Form.Item
              label="Email"
              name="email"
              style={{ flex: 1 }}
              rules={[{ type: "email", message: "Please enter a valid email" }]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select
                placeholder="Select Status"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </Form.Item>
          </Space.Compact>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter complete address"
              style={{ resize: "none" }}
            />
          </Form.Item>

          <Form.Item
            label="Projects (Select one or more)"
            name="projects"
            rules={[
              {
                required: true,
                message: "Please select at least one project",
                type: "array",
              },
            ]}
          >
            <ProjectSelector />
          </Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                form.resetFields();
                setDrawerOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form>
      </Drawer>

      <DialogBox
        open={dialogOpen}
        type="success"
        title="Successful!"
        subTitle="Customer has been saved."
        onOk={() => setDialogOpen(false)}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
};

// Antd Checkbox-based multi-select tile control, compatible with Form.Item's value/onChange
interface ProjectSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const ProjectSelector = ({ value = [], onChange }: ProjectSelectorProps) => {
  const toggle = (val: string, checked: boolean) => {
    const next = checked ? [...value, val] : value.filter((v) => v !== val);
    onChange?.(next);
  };

  return (
    <Row gutter={[12, 12]}>
      {projectOptions.map((opt) => {
        const selected = value.includes(opt.value);
        return (
          <Col span={8} key={opt.value}>
            <div
              onClick={() => toggle(opt.value, !selected)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 8,
                border: selected ? "1.5px solid #6d5bd0" : "1px solid #e5e5e5",
                backgroundColor: selected ? "#f3f1fd" : "#fff",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.15s ease",
              }}
            >
              <Checkbox
                checked={selected}
                onChange={(e: CheckboxChangeEvent) =>
                  toggle(opt.value, e.target.checked)
                }
                onClick={(e) => e.stopPropagation()}
              />
              <span style={{ fontSize: 14 }}>{opt.label}</span>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default ClientsPage;
