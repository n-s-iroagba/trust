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

  static async getAllTransactions(): Promise<TransactionResponse> {
    return ApiService.get<Transaction[]>(API_ROUTES.TRANSACTIONS.GET_ALL);
  }

  static async getTransactionById(id: number): Promise<TransactionResponse> {
    return ApiService.get<Transaction>(API_ROUTES.TRANSACTIONS.GET_BY_ID(id));
  }

  static async getTransactionsByClientWalletId(clientWalletId: number): Promise<TransactionResponse> {
    return ApiService.get<Transaction[]>(API_ROUTES.TRANSACTIONS.GET_BY_CLIENT_WALLET_ID(clientWalletId));
  }

  static async getTransactionsByAdminWalletId(adminWalletId: number): Promise<TransactionResponse> {
    return ApiService.get<Transaction[]>(API_ROUTES.TRANSACTIONS.GET_BY_ADMIN_WALLET_ID(adminWalletId));
  }

  static async deleteTransaction(id: number): Promise<TransactionResponse> {
    return ApiService.delete(API_ROUTES.TRANSACTIONS.DELETE(id));
  }
}