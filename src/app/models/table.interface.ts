import { TemplateRef } from "@angular/core";

export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: T) => string;
  cellClass?: string;
  cellTemplate?: TemplateRef<any>;
  headerClass?: string;
  templateParams?: { [key: string]: any | ((row: T, index: number) => any) };
}

export interface TableAction<T = any> {
  label: string;
  icon?: string;
  class?: string;
  disabled?: (row: T) => boolean;
  visible?: (row: T) => boolean;
  action: (row: T, index: number) => void;
}

export interface TableConfig {
  showHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  containerClass?: string;
  tableClass?: string;
  // 🆕Search properties
  searchable?: boolean;
  searchPlaceholder?: string;
  searchColumns?: string[];
}
