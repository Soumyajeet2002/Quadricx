import React from "react";
import { Space, Typography } from "antd";

const { Text } = Typography;

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "-", color: "#d9d9d9" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  const levels = [
    { label: "-", color: "#d9d9d9" },
    { label: "Weak", color: "#ff4d4f" },
    { label: "Fair", color: "#faad14" },
    { label: "Good", color: "#1677ff" },
    { label: "Strong", color: "#52c41a" },
    { label: "Very Strong", color: "#389e0d" },
  ];

  return { score, ...levels[score] };
}

export function StrengthMeter({ password }: { password?: string }) {
  const { score, label, color } = getPasswordStrength(password || "");
  const segments = 5;

  return (
    <div
      style={{
        background: "#f5f7fa",
        border: "1px solid #eef0f3",
        borderRadius: 8,
        padding: "14px 16px",
        marginTop: 8,
      }}
    >
      <Space size={6} style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 13, color: "#595959" }}>
          Password Strength:
        </Text>
        <Text style={{ fontSize: 13, fontWeight: 600, color }}>{label}</Text>
      </Space>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 4,
              background: i < score ? color : "#e5e7eb",
              transition: "background 0.25s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
