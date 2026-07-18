"use client";

import React, { useState } from "react";
import { Typography, Button, Input, Dropdown, MenuProps } from "antd";
import { PlusOutlined, SearchOutlined, MoreOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { DynamicFormModal } from "@/components";
import type { FormField } from "@/types/components/DynamicFormModal.types";
import styles from "./AlbumsView.module.css";

const { Title, Text } = Typography;

const MOCK_ALBUMS = [
  { id: "a1", name: "Pre Wedding", mediaCount: "245", coverImage: null },
  { id: "a2", name: "Haldi Ceremony", mediaCount: "320", coverImage: null },
  { id: "a3", name: "Sangeet Night", mediaCount: "450", coverImage: null },
  { id: "a4", name: "Wedding Day", mediaCount: "850", coverImage: null },
  { id: "a5", name: "Reception", mediaCount: "520", coverImage: null },
];

export default function AlbumsView({ projectId }: { projectId: string }) {
  const [albums] = useState(MOCK_ALBUMS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const albumFormFields: FormField[] = [
    {
      name: "albumName",
      label: "Album Name",
      type: "text",
      required: true,
      placeholder: "e.g., Sangeet Night",
    },
    {
      name: "coverImage",
      label: "Cover Image (Optional)",
      type: "upload",
      required: false,
    },
  ];

  const handleCreateAlbum = (values: any) => {
    console.log("New Album:", values);
    setIsModalOpen(false);
  };

  const albumMenu: MenuProps = {
    items: [
      { key: "rename", label: "Rename Album" },
      { key: "share", label: "Share Link" },
      { type: "divider" },
      { key: "delete", label: "Delete", danger: true },
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionBar}>
        <Input 
          placeholder="Search albums..." 
          prefix={<SearchOutlined />} 
          className={styles.searchBar}
          size="large"
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          New Album
        </Button>
      </div>

      <div className={styles.albumGrid}>
        {albums.map((album) => (
          <div key={album.id} className={styles.albumCard}>
            <div className={styles.coverWrapper}>
              {album.coverImage ? (
                <img src={album.coverImage} alt={album.name} className={styles.coverImage} />
              ) : (
                <div className={styles.placeholderCover}>
                  <FolderOpenOutlined className={styles.placeholderIcon} />
                </div>
              )}
              
              <div className={styles.cardActions}>
                <Dropdown menu={albumMenu} trigger={['click']} placement="bottomRight">
                  <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
              </div>
            </div>
            
            <div className={styles.albumInfo}>
              <Title level={5} className={styles.albumName}>{album.name}</Title>
              <Text className={styles.mediaCount}>{album.mediaCount} items</Text>
            </div>
          </div>
        ))}
      </div>

      <DynamicFormModal
        title="Create New Album"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateAlbum}
        fields={albumFormFields}
        submitText="Create Album"
      />
    </div>
  );
}
