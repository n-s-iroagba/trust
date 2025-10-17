import { ClientWallet } from './clientWallet';
import { ApiResponse } from './api';

export type TransactionRequestStatus = 'pending' | 'successful' | 'failed';

export interface TransactionRequest {
  id: number;
  clientWalletId: number;
  amountInUSD: number;
  status: TransactionRequestStatus;
  createdAt: string;
  updatedAt: string;
  clientWallet?: ClientWallet & {
    adminWallet?: any;
  };
}

export interface TransactionRequestCreationDto {
  clientWalletId: number;
  amountInUSD: number;
}

export interface UpdateStatusDto {
  status: TransactionRequestStatus;
}

export type TransactionRequestResponse = ApiResponse<TransactionRequest | TransactionRequest[]>;