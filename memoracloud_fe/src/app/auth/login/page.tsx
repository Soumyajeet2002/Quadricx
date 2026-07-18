"use client";

import { useState } from "react";
import { Button, Card, Checkbox, Form, Input, message, Typography } from "antd";
import {
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import { IMAGES } from "@/utils/images";
import apiServer from "@/service/axios-server";
import { useAuthStore } from "@/store/auth.store";
import { RouteConfig } from "@/utils/routeConfig";
import { USER_ROLES } from "@/utils/constants";
import axios from "axios";

const { Title, Text } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const setUser = useAuthStore((state: any) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await apiServer.post("/api/auth/signin", values);
      console.log(result);
      setUser(result.data);
      router.push(RouteConfig.DASHBOARD);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message ?? "Something went wrong",
        );
      } else {
        messageApi.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.loginPage}>
        {/* Background */}
        <div
          className={styles.backgroundImage}
          style={{
            backgroundImage: `url(${IMAGES.EVENT_BG.src})`,
          }}
        />

        {/* Overlay */}
        <div className={styles.overlay} />

        {/* Login Card */}
        <Card className={styles.loginCard} variant="borderless">
          <div className={styles.logoSection}>
            <div className={styles.logoCircle}>M</div>

            {/* <Title level={2} style={{ marginBottom: 0 }}>
            MemoraCloud
          </Title> */}

            <Text type="secondary">Sign in to continue your journey</Text>
          </div>

          <Form<LoginFormValues>
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter email",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="enter your email id or phone number"
                disabled={isLoading}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "enter your password",
                },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                disabled={isLoading}
                autoComplete="off"
              />
            </Form.Item>

            <div className={styles.loginOptions}>
              <Checkbox disabled={isLoading}>Remember me</Checkbox>

              <a
                href="/auth/forgot-password"
                style={{ pointerEvents: isLoading ? "none" : "auto" }}
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              color="purple"
              block
              loading={isLoading}
              disabled={isLoading}
            >
              LOGIN
            </Button>
          </Form>
        </Card>
      </div>
    </>
  );
}
