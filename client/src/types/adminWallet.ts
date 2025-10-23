
import { ApiResponse } from './api';

export interface AdminWallet {
  id: number;

  currencyAbbreviation: string;
  logo: string;
  clientReceivingAddress:string

  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface AdminWalletCreationDto {
  id: number;
  currencyAbbreviation: string;
  logo: string;
  clientReceivingAddress:string

  currency: string;
}

export interface AdminWalletUpdateDto {
 currencyAbbreviation: string;
  logo: string;
  clientReceivingAddress:string

  currency: string;
}

export type AdminWalletResponse = ApiResponse<AdminWallet | AdminWallet[]>;