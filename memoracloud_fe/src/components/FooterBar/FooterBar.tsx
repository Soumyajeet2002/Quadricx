"use client";

import { Layout } from "antd";
import styles from "./FooterBar.module.css";

const { Footer } = Layout;

export default function FooterBar() {
  return (
    <Footer className={styles.footer}>
      © 2026 Event Gallery. All Rights Reserved.
    </Footer>
  );
}
