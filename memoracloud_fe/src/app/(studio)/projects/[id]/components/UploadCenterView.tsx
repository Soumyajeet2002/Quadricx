"use client";

import React from "react";
import { Upload, Typography, Select, Button, Progress, message } from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./UploadCenterView.module.css";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const MOCK_UPLOADS = [
  { id: "1", name: "IMG_9042.CR3", size: "45.2 MB", progress: 100, status: "success" },
  { id: "2", name: "IMG_9043.CR3", size: "44.8 MB", progress: 65, status: "uploading" },
  { id: "3", name: "IMG_9044.CR3", size: "46.1 MB", progress: 0, status: "pending" },
];

export default function UploadCenterView({ projectId }: { projectId: string }) {
  const draggerProps = {
    name: 'file',
    multiple: true,
    action: '#', // mock
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.uploadControls}>
          <Text strong>Upload to Album:</Text>
          <Select
            defaultValue="a1"
            style={{ width: 200 }}
            options={[
              { value: 'a1', label: 'Pre Wedding' },
              { value: 'a2', label: 'Haldi Ceremony' },
              { value: 'a3', label: 'Sangeet Night' },
              { value: 'a4', label: 'Wedding Day' },
            ]}
          />
        </div>
      </div>

      <div className={styles.dropzoneWrapper}>
        <Dragger {...draggerProps} className={styles.dragger}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#2b7cff' }} />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Maximum file size 5GB.
          </p>
        </Dragger>
      </div>

      <div className={styles.uploadQueue}>
        <Title level={5} className={styles.queueTitle}>Upload Queue (3 files)</Title>
        <div className={styles.queueList}>
          {MOCK_UPLOADS.map((file) => (
            <div key={file.id} className={styles.queueItem}>
              <div className={styles.fileInfo}>
                <Text strong className={styles.fileName}>{file.name}</Text>
                <Text type="secondary" className={styles.fileSize}>{file.size}</Text>
              </div>
              <div className={styles.fileProgress}>
                <Progress 
                  percent={file.progress} 
                  status={file.status === 'success' ? 'success' : file.status === 'uploading' ? 'active' : 'normal'}
                  size="small" 
                  style={{ flex: 1, minWidth: 150 }}
                />
                <Button type="text" icon={<DeleteOutlined />} danger size="small" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
