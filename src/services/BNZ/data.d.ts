export type BNZSettings = {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  createdAt?: number;
  expiresAt?: number;
  employer?: number;
  id?: number;
  name: 'BNZ integration (system)';
  operations?: BNZOperations;
  scope?: 'bankfeeds';
  tokenRefreshable?: boolean;
};

export type BNZOperations = {
  trustTransactionImport?: {
    bankAccount?: string;
  };
};

export type BNZAccount = {
  id: string;
  accountNumberFormatted: string;
  accountStatus: string;
  customerNumber: number;
  nickname: string;
  accountTypeCode: string;
};

export type BNZConnectUrl = {
  url: string;
};

export type HistoryPayload = {
  data: History[];
};
export interface History {
  id: number;
  startAt: number;
  finishAt: null | number;
  createdAt: number;
  status: string;
  details?: TransactionDetails;
}
export interface TransactionDetails {
  anyNew: boolean;
  error: boolean;
  imported: number;
  total: number;
  status?: string;
}
export interface TransactionPayload {
  message: string;
  status: string;
}
