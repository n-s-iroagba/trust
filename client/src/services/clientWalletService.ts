    
import { ApiService } from './apiService';
import { API_ROUTES } from '../lib/api-routes';
import { 
  ClientWallet, 
  ClientWalletCreationDto, 
  CreditDebitDto, 
  ClientWalletResponse,
  CreditDebitResponse, 
  ClientWalletWithAssociationsResponse,
  ClientWalletWithAssociations
} from '../types/clientWallet';

export class ClientWalletService {
  static async createClientWallet(data: ClientWalletCreationDto): Promise<ClientWalletResponse> {
    return ApiService.post<ClientWallet>(API_ROUTES.CLIENT_WALLETS.CREATE, data);
  }

  static async getAllClientWallets(): Promise<ClientWalletResponse> {
    return ApiService.get<ClientWallet[]>(API_ROUTES.CLIENT_WALLETS.GET_ALL);
  }

  static async getClientWalletById(id: number): Promise<ClientWalletWithAssociationsResponse> {
    return ApiService.get<ClientWalletWithAssociations>(API_ROUTES.CLIENT_WALLETS.GET_BY_ID(id));
  }

  static async getClientWalletsByClientId(clientId: string): Promise<ClientWalletResponse> {
    return ApiService.get<ClientWallet[]>(API_ROUTES.CLIENT_WALLETS.GET_BY_CLIENT_ID(clientId));
  }

  static async creditWallet(id: number, data: CreditDebitDto): Promise<CreditDebitResponse> {
    return ApiService.post<{ clientWallet: ClientWallet; transaction: any }>(
      API_ROUTES.CLIENT_WALLETS.CREDIT(id), 
      data
    ) as Promise<CreditDebitResponse>;
  }

  static async debitWallet(id: number, data: CreditDebitDto): Promise<CreditDebitResponse> {
    return ApiService.post<{ clientWallet: ClientWallet; transaction: any }>(
      API_ROUTES.CLIENT_WALLETS.DEBIT(id), 
      data
    ) as Promise<CreditDebitResponse>;
  }
}