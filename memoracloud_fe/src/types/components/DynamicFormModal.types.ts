import { Rule } from "antd/es/form";
import React from "react";

export type FormFieldType = "text" | "select" | "date" | "textarea" | "custom" | "upload" | "password";

export interface FormFieldOption {
  label: string;
  value: string | number;
  [key: string]: any;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  options?: FormFieldOption[];
  rules?: Rule[];
  customRender?: () => React.ReactNode;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement; // useful for inserting "+ Add" buttons in Selects
  showSearch?: boolean;
  optionRender?: (option: any) => React.ReactNode;
  fullWidth?: boolean;
  showStrengthMeter?: boolean;
  extra?: React.ReactNode;
}

export interface DynamicFormModalProps {
  title: string;
  open: boolean;
  fields: FormField[];
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  submitText?: string;
  width?: number;
}
