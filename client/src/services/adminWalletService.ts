import { ApiService } from './apiService';
import { API_ROUTES } from '../lib/api-routes';
import { 
  AdminWallet, 
  AdminWalletCreationDto, 
  AdminWalletUpdateDto, 
  AdminWalletResponse 
} from '../types/adminWallet';

export class AdminWalletService {
  static async createAdminWallet(data: AdminWalletCreationDto): Promise<AdminWalletResponse> {
    return ApiService.post<AdminWallet>(API_ROUTES.ADMIN_WALLETS.CREATE, data);
  }

  static async getAllAdminWallets(): Promise<AdminWalletResponse> {
    return ApiService.get<AdminWallet[]>(API_ROUTES.ADMIN_WALLETS.GET_ALL);
  }

  static async getAdminWalletById(id: number): Promise<AdminWalletResponse> {
    return ApiService.get<AdminWallet>(API_ROUTES.ADMIN_WALLETS.GET_BY_ID(id));
  }

  static async updateAdminWallet(id: number, data: AdminWalletUpdateDto): Promise<AdminWalletResponse> {
    return ApiService.put<AdminWallet>(API_ROUTES.ADMIN_WALLETS.UPDATE(id), data);
  }

  static async deleteAdminWallet(id: number): Promise<AdminWalletResponse> {
    return ApiService.delete(API_ROUTES.ADMIN_WALLETS.DELETE(id));
  }
}