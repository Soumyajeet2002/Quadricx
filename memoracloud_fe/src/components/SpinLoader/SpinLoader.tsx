"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./SpinLoader.module.css";

// Dynamically import lottie-react to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface SpinLoaderProps {
  /** Controls overlay visibility */
  visible: boolean;
}

export function SpinLoader({ visible }: SpinLoaderProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [mounted, setMounted] = useState(false);

  // Avoid SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
    fetch("/animations/page-loader.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("[SpinLoader] Failed to load animation:", err));
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.visible : ""}`}
      aria-hidden={!visible}
      role="status"
      aria-label="Loading page..."
    >
      <div className={styles.card}>
        <div className={styles.lottieWrapper}>
          {animationData && (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: 120, height: 120 }}
            />
          )}
        </div>

        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>

        <span className={styles.label}>Loading…</span>
      </div>
    </div>
  );
}
