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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { DataTable, DialogBox } from "@/components";
import type { ColumnsType } from "antd/es/table";

interface User {
  id: string;
  organisationName: string;
  ownerName: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  status: "Active" | "Inactive";
}

const users: User[] = [
  {
    id: "1",
    organisationName: "Dream Lens Studio",
    ownerName: "Rahul Sharma",
    role: "Photographer",
    phone: "9876543210",
    email: "rahul@dreamlens.com",
    address: "Saheed Nagar, Bhubaneswar, Odisha",
    status: "Active",
  },
  {
    id: "2",
    organisationName: "Pixel Perfect Photography",
    ownerName: "Ananya Das",
    role: "Studio Owner",
    phone: "9123456789",
    email: "contact@pixelperfect.com",
    address: "Patia, Bhubaneswar, Odisha",
    status: "Active",
  },
  {
    id: "3",
    organisationName: "Moments Forever Studio",
    ownerName: "Sourav Mishra",
    role: "Photo Editor",
    phone: "9012345678",
    email: "editor@momentsforever.com",
    address: "Cuttack Road, Bhubaneswar, Odisha",
    status: "Inactive",
  },
  {
    id: "4",
    organisationName: "Royal Clicks",
    ownerName: "Priya Mohanty",
    role: "Photographer",
    phone: "9988776655",
    email: "info@royalclicks.com",
    address: "Jaydev Vihar, Bhubaneswar, Odisha",
    status: "Active",
  },
  {
    id: "5",
    organisationName: "Wedding Memories Studio",
    ownerName: "Amit Patel",
    role: "Studio Manager",
    phone: "9765432109",
    email: "amit@weddingmemories.com",
    address: "Chandrasekharpur, Bhubaneswar, Odisha",
    status: "Active",
  },
  {
    id: "6",
    organisationName: "Focus Frame Studio",
    ownerName: "Neha Gupta",
    role: "Photographer",
    phone: "9871234567",
    email: "hello@focusframe.com",
    address: "Rasulgarh, Bhubaneswar, Odisha",
    status: "Inactive",
  },
  {
    id: "7",
    organisationName: "Capture World",
    ownerName: "Rakesh Sahoo",
    role: "Videographer",
    phone: "9345678901",
    email: "support@captureworld.com",
    address: "Khandagiri, Bhubaneswar, Odisha",
    status: "Active",
  },
  {
    id: "8",
    organisationName: "Snapshot Studio",
    ownerName: "Sneha Rout",
    role: "Photo Editor",
    phone: "9090909090",
    email: "admin@snapshotstudio.com",
    address: "Nayapalli, Bhubaneswar, Odisha",
    status: "Active",
  },
];

// Helper function to get initials and color
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const avatarColors = [
  "#7c3aed", // purple
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#8b5cf6", // violet
];

const getAvatarColor = (index: number) => {
  return avatarColors[index % avatarColors.length];
};

export default function UsersPage() {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: ColumnsType<User> = [
    {
      title: "Organisation Name",
      dataIndex: "organisationName",
      key: "organisationName",
      width: 240,
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

          <Link
            href={`/user-management/${record.id}`}
            style={{
              color: "#1677ff",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {text}
          </Link>
        </Space>
      ),
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      width: 180,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 150,
    },
    {
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
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

  const handleEdit = (record: User) => {
    console.log("Edit:", record);
    // Add your edit logic here
  };

  const handleDelete = (record: User) => {
    console.log("Delete:", record);
    // Add your delete logic here
  };

  return (
    <>
      {/* <Button type="primary" onClick={() => setOpen(true)}>
        Open Dialog
      </Button> */}

      <DataTable<User>
        columns={columns}
        data={users}
        rowKey="id"
        searchableKeys={["organisationName", "ownerName", "phone"]}
        pageSize={10}
      />

      <FloatButton
        icon={<UserAddOutlined />}
        type="primary"
        tooltip="Add User"
        onClick={() => setDrawerOpen(true)}
      />

      <Drawer
        title="Add Organisation"
        placement="right"
        size={450}
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
          onFinish={(values) => {
            console.log(values);

            // API Call Here

            form.resetFields();
            setDrawerOpen(false);
          }}
        >
          <Form.Item
            label="Organisation Name"
            name="organisationName"
            rules={[
              {
                required: true,
                message: "Please enter organisation name",
              },
            ]}
          >
            <Input placeholder="Enter organisation name" />
          </Form.Item>

          <Form.Item
            label="Owner Name"
            name="ownerName"
            rules={[
              {
                required: true,
                message: "Please enter owner name",
              },
            ]}
          >
            <Input placeholder="Enter owner name" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            initialValue=""
            rules={[
              {
                required: true,
                message: "Please select role",
              },
            ]}
          >
            <Select
              placeholder="Select Role"
              options={[
                {
                  label: "Active",
                  value: "Active",
                },
                {
                  label: "Inactive",
                  value: "Inactive",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Phone No"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please enter phone number",
              },
              {
                pattern: /^[6-9]\d{9}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" maxLength={10} />
          </Form.Item>

          <Form.Item
            label="Email ID"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter email",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter address",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter complete address"
              style={{ resize: "none" }}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue="Active"
            rules={[
              {
                required: true,
                message: "Please select status",
              },
            ]}
          >
            <Select
              placeholder="Select Status"
              options={[
                {
                  label: "Active",
                  value: "Active",
                },
                {
                  label: "Inactive",
                  value: "Inactive",
                },
              ]}
            />
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
        open={open}
        type="success"
        title="Successful!"
        subTitle="Your information has been saved."
        onOk={() => {
          console.log("Confirmed");
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
