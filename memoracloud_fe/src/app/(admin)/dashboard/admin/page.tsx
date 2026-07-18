"use client";

import { Card, Typography, Space } from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formatted = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setCurrentTime(formatted + " IST");
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card variant="borderless">
      <Space vertical size={4}>
        <Title level={3} style={{ margin: 0 }}>
          👋 Welcome Back, Admin
        </Title>

        <Text type="secondary">
          Manage your organization, users, subscriptions, and reports from a
          single dashboard.
        </Text>

        <Text strong style={{ fontSize: 18 }}>
          🕒 {currentTime}
        </Text>
      </Space>
    </Card>
  );
};

export default AdminDashboard;
