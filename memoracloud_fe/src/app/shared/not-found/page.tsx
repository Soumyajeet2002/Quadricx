"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import styles from "./NotFound.module.css";
import { useEffect, useState } from "react";

const NotFoundPage = () => {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Fetch the animation from the public folder instead of importing it
    fetch("/animations/not-found.json")
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
            minHeight: "220px", // Prevent layout shift
          }}
        >
          {animationData && (
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: 220, height: 220, opacity: 0.9 }}
            />
          )}
        </div>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <Button
          type="primary"
          size="large"
          className={styles.homeButton}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};
export default NotFoundPage;
