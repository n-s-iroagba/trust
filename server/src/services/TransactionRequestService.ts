import { TransactionRequestRepository } from '../repositories/TransactionRequestRepository';
import { ClientWalletService } from './ClientWalletService';
import { CalculationHelpers } from './utils/calculationHelpers';
import { ValidationHelpers } from './utils/validationHelpers';
import { AppError, NotFoundError } from './errors/AppError';
import logger from './logger/winstonLogger';

export interface TransactionRequestCreationDto {
  clientWalletId: number;
  amountInUSD: number;
}

export interface UpdateStatusDto {
  status: 'pending' | 'successful' | 'failed';
}

export class TransactionRequestService {
  private transactionRequestRepository: TransactionRequestRepository;
  private clientWalletService: ClientWalletService;

  constructor() {
    this.transactionRequestRepository = new TransactionRequestRepository();
    this.clientWalletService = new ClientWalletService();
  }

  async createTransactionRequest(createDto: TransactionRequestCreationDto) {
    try {
      if (!CalculationHelpers.isValidAmount(createDto.amountInUSD)) {
        throw new AppError('Invalid amount', 400);
      }

      const transactionRequestData = {
        ...createDto,
        status: 'pending' as const
      };

      const transactionRequest = await this.transactionRequestRepository.create(transactionRequestData);
      logger.info(`Transaction request created: ${transactionRequest.id} with status: pending`);
      
      return transactionRequest;
    } catch (error) {
      logger.error('Error creating transaction request:', error);
      throw error;
    }
  }

  async updateTransactionRequestStatus(id: number, updateDto: UpdateStatusDto) {
    try {
      if (!ValidationHelpers.isValidStatus(updateDto.status)) {
        throw new AppError('Invalid status', 400);
      }

      const transactionRequest = await this.transactionRequestRepository.findById(id);
      if (!transactionRequest) {
        throw new NotFoundError('Transaction request');
      }

      if (transactionRequest.status === updateDto.status) {
        return transactionRequest;
      }

      if (updateDto.status === 'successful') {
        await this.clientWalletService.creditWallet(transactionRequest.clientWalletId, {
          amountInUSD: transactionRequest.amountInUSD,
          adminWalletId: (await this.transactionRequestRepository.findByIdWithAdminWalletAndClientWallet(id))!
            .clientWallet.adminWalletId
        });
      }

      const [affectedCount] = await this.transactionRequestRepository.updateStatus(id, updateDto.status);
      
      if (affectedCount === 0) {
        throw new AppError('Failed to update transaction request status');
      }

      const updatedRequest = await this.transactionRequestRepository.findByIdWithAdminWalletAndClientWallet(id);
      logger.info(`Transaction request status updated: ${id} to ${updateDto.status}`);
      
      return updatedRequest;
    } catch (error) {
      logger.error('Error updating transaction request status:', error);
      throw error;
    }
  }

  async getTransactionRequestById(id: number) {
    try {
      const transactionRequest = await this.transactionRequestRepository.findByIdWithAdminWalletAndClientWallet(id);
      if (!transactionRequest) {
        throw new NotFoundError('Transaction request');
      }
      return transactionRequest;
    } catch (error) {
      logger.error('Error fetching transaction request by id:', error);
      throw error;
    }
  }

  async getTransactionRequestsByClientWalletId(clientWalletId: number) {
    try {
      return await this.transactionRequestRepository.findAllByClientWalletIdWithAdminWalletAndClientWallet(clientWalletId);
    } catch (error) {
      logger.error('Error fetching transaction requests by client wallet ID:', error);
      throw error;
    }
  }

  async getTransactionRequestsByStatus(status: 'pending' | 'successful' | 'failed') {
    try {
      if (!ValidationHelpers.isValidStatus(status)) {
        throw new AppError('Invalid status', 400);
      }

      return await this.transactionRequestRepository.findAllByStatus(status);
    } catch (error) {
      logger.error('Error fetching transaction requests by status:', error);
      throw error;
    }
  }
}