import { ApiService } from './apiService';
import { API_ROUTES } from '../lib/api-routes';
import { 
  Transaction, 
  TransactionCreationDto, 
  TransactionResponse 
} from '../types/transaction';

export class TransactionService {
  static async createTransaction(data: TransactionCreationDto): Promise<TransactionResponse> {
    return ApiService.post<Transaction>(API_ROUTES.TRANSACTIONS.CREATE, data);
  }

  static async updateTransaction(id: number, data: Partial<Transaction>): Promise<TransactionResponse> {
    return ApiService.put<Transaction>(API_ROUTES.TRANSACTIONS.UPDATE(id), data);
  }

  static async updateTransactionStatus(id: number, data: Partial<Transaction>): Promise<TransactionResponse> {
    return ApiService.put<Transaction>(API_ROUTES.TRANSACTIONS.UPDATE_STATUS(id), data);
  }

  static async getTransactionsByClientWalletId(clientWalletId: number): Promise<TransactionResponse> {
    return ApiService.get<Transaction[]>(API_ROUTES.TRANSACTIONS.GET_BY_CLIENT_WALLET_ID(clientWalletId));
  }

  static async getTransactionsByClientId(clientId: number): Promise<TransactionResponse> {
    return ApiService.get<Transaction[]>(API_ROUTES.TRANSACTIONS.GET_BY_CLIENT_ID(clientId));
  }

  static async getPendingTransactions(): Promise<TransactionResponse> {
    return ApiService.get<Transaction[]>(API_ROUTES.TRANSACTIONS.GET_PENDING);
  }

  static async deleteTransaction(id: number): Promise<TransactionResponse> {
    return ApiService.delete(API_ROUTES.TRANSACTIONS.DELETE(id));
  }
}