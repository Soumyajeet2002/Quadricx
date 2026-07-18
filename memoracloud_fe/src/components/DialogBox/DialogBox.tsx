"use client";

import React, { useEffect, useState } from "react";
import { Modal, Result, Button } from "antd";
import dynamic from "next/dynamic";
import styles from "./DialogBox.module.css";

// Dynamically import lottie-react
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export type DialogType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "403"
  | "404"
  | "500";

interface DialogBoxProps {
  open: boolean;
  type?: DialogType;
  title: string;
  subTitle?: string;
  extra?: React.ReactNode;
  width?: number;
  loading?: boolean;
  centered?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel: () => void;
}

const ANIMATION_PATH: Record<string, string> = {
  success: "/animations/success-stars.json",
  error: "/animations/error-burst.json",
};

function resolveHeroType(
  type: DialogType,
): "success" | "error" | "info" | "warning" {
  if (type === "success") return "success";
  if (type === "error" || type === "403" || type === "404" || type === "500")
    return "error";
  if (type === "warning") return "warning";
  return "info";
}

const DialogBox: React.FC<DialogBoxProps> = ({
  open,
  type = "info",
  title,
  subTitle,
  extra,
  width = 420,
  loading = false,
  centered = true,
  okText,
  cancelText = "Close",
  onOk,
  onCancel,
}) => {
  const heroType = resolveHeroType(type);
  const animPath = ANIMATION_PATH[heroType] ?? null;
  const [animData, setAnimData] = useState<object | null>(null);

  useEffect(() => {
    if (!animPath) return;
    fetch(animPath)
      .then((r) => r.json())
      .then(setAnimData)
      .catch(() => setAnimData(null));
  }, [animPath]);

  const resolvedOkText =
    okText ?? (heroType === "success" ? "Great!" : "Confirm");

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered={centered}
      closable={false}
      width={width}
      destroyOnHidden
      className={styles.modalRoot}
    >
      {/* 1. Full Modal Background Layer for Lottie */}
      {animData && (
        <div className={styles.lottieBackground}>
          <Lottie
            animationData={animData}
            loop
            autoplay
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* 2. Transparent Top Gradient Header Band */}
      <div className={`${styles.hero} ${styles[heroType]}`} />

      {/* 3. Unified Layout using Ant Design Result Component */}
      <div className={styles.body}>
        <Result
          status={
            heroType === "warning"
              ? "warning"
              : heroType === "error"
                ? "error"
                : heroType
          }
          title={title}
          subTitle={subTitle}
          extra={
            extra ?? (
              <div className={styles.actions}>
                {onOk && (
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={onOk}
                    className={`${styles.btnOk} ${styles[heroType]}`}
                  >
                    {resolvedOkText}
                  </Button>
                )}
                <Button
                  danger
                  ghost
                  onClick={onCancel}
                  //className={styles.btnCancel}
                >
                  {cancelText}
                </Button>
              </div>
            )
          }
        />
      </div>
    </Modal>
  );
};

export default DialogBox;
