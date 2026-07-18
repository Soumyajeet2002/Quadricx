"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { STATUS_CODE, STATUS_MESSAGE } from "@/utils/constants";
import styles from "./NotAuthorized.module.css";
import { useEffect, useState } from "react";

const NotAuthorized = () => {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/animations/no-access.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
            minHeight: "180px",
          }}
        >
          {animationData && (
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: 180, height: 180, opacity: 0.8 }}
            />
          )}
        </div>
        <h1 className={styles.errorCode}>{STATUS_CODE.UNAUTHORIZED}</h1>
        <h2 className={styles.title}>{STATUS_MESSAGE.ACCESS_DENIED}</h2>
        <p className={styles.description}>
          You do not have the required permissions to access this page
        </p>
        <Button
          type="primary"
          size="large"
          className={styles.backButton}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotAuthorized;
