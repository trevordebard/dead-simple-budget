import { Transaction as PlaidTransaction } from 'plaid';

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

export interface iImportPlaidTransactionsInput {
  transactions: PlaidTransaction[];
  stack?: string; // preferred stack for all imported transactions
}
