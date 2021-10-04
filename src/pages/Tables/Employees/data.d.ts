export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
interface FuseOptions {
  keys: Array<string>;
  threshold: number | void;
}

interface Employer {
  cancelled: null | boolean;
  contactEmail: string | null;
  contactFirstName: string | null;
  contactLastName: string | null;
  contactPhone: string | null;
  displayName: string | null;
  id: number;
  irdNumber: string | null;
  registeredCompanyName: string | null;
  verificationStatus: string;
}

interface TableListItem extends Employer {
  refIndex: number;
}

interface VerificationSatusToggleForm {
  reason: string;
}
