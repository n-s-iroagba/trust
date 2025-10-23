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
  reciepientAddress: string;
  type: TransactionType;
  amount: string;
  status: TransactionStatus;
  date: string;
  fee: string;
  isAdminCreated?:boolean
  createdAt?: Date;
  updatedAt?: Date;
  clientWallet?: ClientWalletWithAssociations;
}



export interface TransactionCreationDto {
  amountInUSD: number;
  clientWalletId: number;
  reciepientAddress:string
  type:'debit'|'credit',
}

export type TransactionResponse = ApiResponse<Transaction | Transaction[]>;
