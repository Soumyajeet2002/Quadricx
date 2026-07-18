"use client";

import { useMemo, useState, useCallback } from "react";
import { Input, Table, Typography, Select, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./DataTable.module.css";

const { Search } = Input;
const { Text } = Typography;

export interface DataTableProps<T extends object> {
  columns: ColumnsType<T>;
  data: T[];
  rowKey: keyof T | ((record: T) => React.Key);
  searchableKeys?: (keyof T)[];
  loading?: boolean;
  pageSize?: number;
  showSearch?: boolean;
}

function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  searchableKeys = [],
  loading = false,
  pageSize: initialPageSize = 10,
  showSearch = true,
}: DataTableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the search changes
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const keyword = searchText.toLowerCase();

    return data.filter((item) =>
      searchableKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }, [data, searchText, searchableKeys]);

  // Derived values for the records summary
  const totalRecords = filteredData.length;
  const rangeStart = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.pageSizeControl}>
          <Text strong>Rows per page:</Text>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
            options={[
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
          />
        </div>

        {showSearch && (
          <div className={styles.headerRight}>
            <Search
              allowClear
              placeholder="Search by name, email or city..."
              onChange={handleSearch}
              className={styles.search}
            />
          </div>
        )}
      </div>

      <Table<T>
        bordered={false}
        rowKey={rowKey}
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        scroll={{ x: "max-content" }}
        className={styles.table}
        rowClassName={styles.tableRow}
        pagination={false}
      />

      {/* Custom footer: records summary on left, page nav on right */}
      <div className={styles.tableFooter}>
        <Text className={styles.recordsSummary}>
          Showing <span className={styles.recordsHighlight}>{rangeStart}</span>{" "}
          to <span className={styles.recordsHighlight}>{rangeEnd}</span> of{" "}
          <span className={styles.recordsHighlight}>{totalRecords}</span>{" "}
          records
        </Text>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          onChange={setCurrentPage}
          showSizeChanger={false}
          className={styles.footerPagination}
        />
      </div>
    </div>
  );
}

export default DataTable;
