
import { ApiResponse } from './api';

export interface AdminWallet {
  id: number;
  currencyAbbreviation: string;
  logo: string;
  address: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminWalletCreationDto {
  currencyAbbreviation: string;
  logo: string;
  currency: string;
}

export interface AdminWalletUpdateDto {
  currencyAbbreviation?: string;
  logo?: string;
  currency?: string;
}

export type AdminWalletResponse = ApiResponse<AdminWallet | AdminWallet[]>;