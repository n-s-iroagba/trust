import {ClientWalletWithAssociations } from './clientWallet';
import { ApiResponse } from './api';

// ✅ Enums for type and status
export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

// ✅ Interface using the enums
export interface Transaction {
  id: number;
  amountInUSD: number;
  clientWalletId: number;
  recipientAddress : string;
  type: TransactionType;
  amount: string;
  status: TransactionStatus;
  date: string;
  fee: number;
  isAdminCreated?:boolean
  createdAt?: Date;
  updatedAt?: Date;
  clientWallet?: ClientWalletWithAssociations;
}



export interface TransactionCreationDto {
  amountInUSD: number;
  clientWalletId: number;
  recipientAddress :string
  type:'debit'|'credit',
  status?:TransactionStatus
  fee?:number
  isAdminCreated:boolean
}

export type TransactionResponse = ApiResponse<Transaction | Transaction[]>;
