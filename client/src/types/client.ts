

import { ApiResponse } from './api';
import { ClientWallet } from './clientWallet';

export interface Client {
  id: number;
  lastName: string;
  firstName: string;
  signInCode: string;
  phrase12Word: string[];
  wallets?: ClientWallet[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientCreationDto {
  lastName: string;
  firstName: string;
  signInCode: string;
  phrase12Word: string[];
}

export interface ClientUpdateDto {
  lastName?: string;
  firstName?: string;
  signInCode?: string;
  phrase12Word?: string[];
}

export interface ClientResponse extends ApiResponse<Client> {}
export interface ClientsResponse extends ApiResponse<Client[]> {}