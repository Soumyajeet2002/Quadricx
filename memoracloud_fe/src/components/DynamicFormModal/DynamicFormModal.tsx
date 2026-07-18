"use client";

import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Space, Upload, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import {
  DynamicFormModalProps,
  FormField,
} from "@/types/components/DynamicFormModal.types";
import styles from "./DynamicFormModal.module.css";
import { StrengthMeter } from "./StrengthMeter";

const { TextArea } = Input;
const { Dragger } = Upload;
const { Text } = Typography;

const DynamicFormModal: React.FC<DynamicFormModalProps> = ({
  title,
  open,
  fields,
  onCancel,
  onSubmit,
  loading = false,
  submitText = "Submit",
  width = 800,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const renderFieldInput = (field: FormField) => {
    if (field.customRender) {
      return field.customRender();
    }

    switch (field.type) {
      case "text":
        return (
          <Input
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            size="large"
          />
        );
      case "password":
        return (
          <Input.Password
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            size="large"
          />
        );
      case "textarea":
        return (
          <TextArea
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            rows={4}
            size="large"
          />
        );
      case "select":
        return (
          <Select
            placeholder={field.placeholder}
            options={field.options}
            popupRender={field.dropdownRender}
            optionRender={field.optionRender}
            showSearch={field.showSearch}
            filterOption={
              field.showSearch
                ? (input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                : undefined
            }
            size="large"
          />
        );
      case "date":
        return <DatePicker style={{ width: "100%" }} size="large" />;
      case "upload":
        return (
          <Dragger 
            name="file" 
            multiple={false} 
            maxCount={1}
            beforeUpload={() => false} // Prevent automatic upload, handle on form submit
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single image upload.
            </p>
          </Dragger>
        );
      default:
        return <Input placeholder={field.placeholder} size="large" />;
    }
  };

  return (
    <Modal
      title={<div className={styles.modalTitle}>{title}</div>}
      open={open}
      onCancel={handleCancel}
      width={width}
      footer={null} // We use form footer instead for better layout control
      destroyOnHidden
      centered
      className={styles.modalWrapper}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className={styles.formContainer}
      >
        <div className={styles.formContent}>
          {fields.map((field) => {
            const isUpload = field.type === "upload";
            const normFile = (e: any) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            };

            const PasswordStrengthWatcher = ({ fieldName, formInstance }: { fieldName: string, formInstance: any }) => {
              const currentVal = Form.useWatch(fieldName, formInstance);
              return <StrengthMeter password={currentVal} />;
            };

            return (
              <React.Fragment key={field.name}>
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                extra={field.extra}
                valuePropName={isUpload ? "fileList" : undefined}
                getValueFromEvent={isUpload ? normFile : undefined}
                rules={
                  field.rules || [
                    {
                      required: field.required,
                      message: `${field.label} is required`,
                    },
                  ]
                }
                className={`${styles.formItem} ${
                  field.fullWidth || isUpload || field.type === "textarea"
                    ? styles.formItemFull
                    : ""
                }`}
              >
                {renderFieldInput(field)}
              </Form.Item>
              {field.type === "password" && field.showStrengthMeter && (
                <div style={{ marginTop: "-12px", marginBottom: "24px" }} className={field.fullWidth ? styles.formItemFull : ""}>
                  <PasswordStrengthWatcher fieldName={field.name} formInstance={form} />
                </div>
              )}
              </React.Fragment>
            );
          })}
        </div>

        <div className={styles.formFooter}>
          <Space size="middle">
            <Button onClick={() => form.resetFields()}>Reset</Button>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.submitBtn}
            >
              {submitText}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default DynamicFormModal;
