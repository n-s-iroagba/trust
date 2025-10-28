import { AdminWalletRepository } from '../repositories/AdminWalletRepository';
import { AddressGenerator } from './utils/addressGenerator';
import { AppError, NotFoundError, ConflictError } from './errors/AppError';
import logger from './logger/winstonLogger';
import { ValidationHelpers } from './utils/validationHelpers';

export interface AdminWalletCreationDto {
  currencyAbbreviation: string;
  logo: string;
  clientReceivingAddress:string
 
  currency: string;
}

export interface AdminWalletUpdateDto {
  currencyAbbreviation?: string;
  logo?: string;
  clientReceivingAddress:string
 
  currency: string;
}

export class AdminWalletService {
  private adminWalletRepository: AdminWalletRepository;

  constructor() {
    this.adminWalletRepository = new AdminWalletRepository();
  }

  async createAdminWallet(createDto: AdminWalletCreationDto) {
    try {
      if (!ValidationHelpers.isValidCurrencyAbbreviation(createDto.currencyAbbreviation)) {
        throw new AppError('Invalid currency abbreviation', 400);
      }

      const address = AddressGenerator.generateAdminWalletAddress();
      
      const existingWallet = await this.adminWalletRepository.findByAddress(address);
      if (existingWallet) {
        throw new ConflictError('Wallet address already exists');
      }

      const adminWalletData = {
        ...createDto,
        address
      };

      const adminWallet = await this.adminWalletRepository.create(adminWalletData);
      logger.info(`Admin wallet created: ${adminWallet.id}`);
      
      return adminWallet;
    } catch (error) {
      logger.error('Error creating admin wallet:', error);
      throw error;
    }
  }

  async updateAdminWallet(id: number, updateDto: AdminWalletUpdateDto) {
    try {
      const existingWallet = await this.adminWalletRepository.findById(id);
      if (!existingWallet) {
        throw new NotFoundError('Admin wallet');
      }

      if (updateDto.currencyAbbreviation && !ValidationHelpers.isValidCurrencyAbbreviation(updateDto.currencyAbbreviation)) {
        throw new AppError('Invalid currency abbreviation', 400);
      }

      await this.adminWalletRepository.update(updateDto, { where: { id } });
     

      const updatedWallet = await this.adminWalletRepository.findById(id);
      logger.info(`Admin wallet updated: ${id}`);
      
      return updatedWallet;
    } catch (error) {
      logger.error('Error updating admin wallet:', error);
      throw error;
    }
  }

  async getAllAdminWallets() {
    try {
      return await this.adminWalletRepository.findAllWithAssociations();
    } catch (error) {
      logger.error('Error fetching all admin wallets:', error);
      throw error;
    }
  }

  async getAdminWalletById(id: number) {
    try {
      const adminWallet = await this.adminWalletRepository.findByIdWithAssociations(id);
      if (!adminWallet) {
        throw new NotFoundError('Admin wallet');
      }
      return adminWallet;
    } catch (error) {
      logger.error('Error fetching admin wallet by id:', error);
      throw error;
    }
  }

  async deleteAdminWallet(id: number) {
    try {
      const existingWallet = await this.adminWalletRepository.findById(id);
      if (!existingWallet) {
        throw new NotFoundError('Admin wallet');
      }

      const hasClientWallets = await this.adminWalletRepository.checkIfHasClientWallets(id);
      if (hasClientWallets) {
        throw new ConflictError('Cannot delete admin wallet with existing client wallets');
      }

      const deletedCount = await this.adminWalletRepository.delete(id)
      


      logger.info(`Admin wallet deleted: ${id}`);
      return { message: 'Admin wallet deleted successfully' };
    } catch (error) {
      logger.error('Error deleting admin wallet:', error);
      throw error;
    }
  }
}