import { ApiService } from './apiService';
import { API_ROUTES } from '../lib/api-routes';
import { 
  Client,
  ClientResponse,
  ClientsResponse, 
} from '../types/client';

export class ClientService {
  
  static async getAllClients(): Promise<ClientsResponse> {
    return ApiService.get<Client[]>(API_ROUTES.CLIENTS.GET_ALL);
  }

  static async getClientById(id: number): Promise<ClientResponse> {
    return ApiService.get<Client>(API_ROUTES.CLIENTS.GET_BY_ID(id));
  }



  static async deleteClient(id: number): Promise<{ success: boolean; message: string }> {
    return ApiService.delete(API_ROUTES.CLIENTS.DELETE(id));
  }

  static async getClientWallets(clientId: number): Promise<any> {
    return ApiService.get(API_ROUTES.CLIENTS.GET_WALLETS(clientId));
  }
}