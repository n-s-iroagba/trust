import { ApiService } from './apiService';
import { API_ROUTES } from '../lib/api-routes';
import { 
  TransactionRequest, 
  TransactionRequestCreationDto, 
  UpdateStatusDto, 
  TransactionRequestResponse 
} from '../types/transactionRequest';
    
export class TransactionRequestService {
  static async createTransactionRequest(data: TransactionRequestCreationDto): Promise<TransactionRequestResponse> {
    return ApiService.post<TransactionRequest>(API_ROUTES.TRANSACTION_REQUESTS.CREATE, data);
  }

  static async getTransactionRequestById(id: number): Promise<TransactionRequestResponse> {
    return ApiService.get<TransactionRequest>(API_ROUTES.TRANSACTION_REQUESTS.GET_BY_ID(id));
  }

  static async getTransactionRequestsByClientWalletId(clientWalletId: number): Promise<TransactionRequestResponse> {
    return ApiService.get<TransactionRequest[]>(API_ROUTES.TRANSACTION_REQUESTS.GET_BY_CLIENT_WALLET_ID(clientWalletId));
  }

  static async getTransactionRequestsByStatus(status: 'pending' | 'successful' | 'failed'): Promise<TransactionRequestResponse> {
    return ApiService.get<TransactionRequest[]>(API_ROUTES.TRANSACTION_REQUESTS.GET_BY_STATUS(status));
  }

  static async updateTransactionRequestStatus(id: number, data: UpdateStatusDto): Promise<TransactionRequestResponse> {
    return ApiService.patch<TransactionRequest>(API_ROUTES.TRANSACTION_REQUESTS.UPDATE_STATUS(id), data);
  }
}