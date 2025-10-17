import { AdminWallet } from './adminWallet';
import { Transaction } from './transaction';
import { ApiResponse } from './api';
interface User {
    firstName:string
    lastName:string
}
export interface ClientWallet {
  id: number;
  adminWalletId: number;
  clientId: string;
  address: string;
  amountInUSD: number;
  createdAt: string;
  updatedAt: string;
  adminWallet?: AdminWallet;
  user?:User
}

export interface ClientWalletCreationDto {
  adminWalletId: number;
  clientId: string;
}

export interface CreditDebitDto {
  amountInUSD: number;
  adminWalletId: number;
}

export type ClientWalletResponse = ApiResponse<ClientWallet | ClientWallet[]>;

export interface CreditDebitResponse {
  success: boolean;
  message: string;
  data: {
    clientWallet: ClientWallet;
    transaction: Transaction;
  };
}
