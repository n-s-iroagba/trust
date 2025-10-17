import { AdminWallet } from './adminWallet';
import { ClientWallet } from './clientWallet';
import { ApiResponse } from './api';

export interface Transaction {
  id: number;
  amountInUSD: number;
  clientWalletId: number;
  adminWalletId: number;
  createdAt: string;
  updatedAt: string;
  adminWallet?: AdminWallet;
  clientWallet?: ClientWallet;
}

export interface TransactionCreationDto {
  amountInUSD: number;
  clientWalletId: number;
  adminWalletId: number;
}

export type TransactionResponse = ApiResponse<Transaction | Transaction[]>;