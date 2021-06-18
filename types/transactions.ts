export interface iEditTransactionInput {
  description?: string;
  stack?: string;
  amount?: number;
  type?: string;
  date?: string;
}

export interface iCreateTransactionInput {
  description: string;
  stack: string;
  amount: number;
  type: string;
  date: string;
}

export interface iDeleteTransactionsInput {
  transactionIds: number[];
}
