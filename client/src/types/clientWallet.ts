import { AdminWallet } from './adminWallet';
import { Transaction } from './transaction';
import { ApiResponse } from './api';
import { Client } from './client';

export interface ClientWallet {
  id: number;
  adminWalletId: number;
  clientId: string;
  address: string;
  amountInUSD: number;
  createdAt: string;
  updatedAt: string;
  adminWallet: AdminWallet;
  client?:Client
}

export interface ClientWalletCreationDto {
  adminWalletId: number;
  clientId: string;
}

export interface CreditDebitDto {
  amountInUSD: number;
}
export interface ClientWalletWithAssociations extends ClientWallet{
  client:Client
  transactions:Transaction[]
  
}

export type ClientWalletWithAssociationsResponse = ApiResponse<ClientWalletWithAssociations>;
export type ClientWalletResponse = ApiResponse<ClientWallet | ClientWallet[]>;

export interface CreditDebitResponse {
  success: boolean;
  message: string;
  data: {
    clientWallet: ClientWallet;
    transaction: Transaction;
  };
}
