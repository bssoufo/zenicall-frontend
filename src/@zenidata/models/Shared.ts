export interface PaginationListOption {
  search: string;
  status: string;
  page: number;
  limit: number;
  orderBy?: string;
  direction?: "asc" | "desc";
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type BulkAction = "process" | "download" | "delete"| "archive"| "export";

export interface AlertMessage {
  type: "error" | "success" | "infos";
  content: string;
}
