import { TransactionRepository } from '../repositories/TransactionRepository';
import { ClientWalletRepository } from '../repositories/ClientWalletRepository';
import { CalculationHelpers } from './utils/calculationHelpers';
import { ValidationHelpers } from './utils/validationHelpers';
import { AppError, NotFoundError } from './errors/AppError';
import logger from './logger/winstonLogger';
interface UpdateStatusDto{
  status: 'successful' | 'failed'
}
import { ClientWalletService } from './ClientWalletService';

export interface TransactionCreationDto {
  amountInUSD: number;
  clientWalletId: number;
  adminWalletId: number;
}

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private clientWalletRepository: ClientWalletRepository;
  private clientWalletService: ClientWalletService;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.clientWalletRepository = new ClientWalletRepository();
  }

  async createTransaction(createDto: TransactionCreationDto) {
    try {
      if (!CalculationHelpers.isValidAmount(Math.abs(createDto.amountInUSD))) {
        throw new AppError('Invalid amount', 400);
      }

      const clientWallet = await this.clientWalletRepository.findById(createDto.clientWalletId);
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }

      const transaction = await this.transactionRepository.create(createDto);
      logger.info(`Transaction created: ${transaction.id} for wallet: ${createDto.clientWalletId}`);
      
      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }



  async updateTransactionStatus(id: number, updateDto: UpdateStatusDto) {
    try {
      if (!ValidationHelpers.isValidStatus(updateDto.status)) {
        throw new AppError('Invalid status', 400);
      }

      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new NotFoundError('Transaction request');
      }

      if (transaction.status === updateDto.status) {
        return transaction;
      }

      if (updateDto.status === 'successful') {
        await this.clientWalletService.creditWallet(transaction.clientWalletId,transaction.amountInUSD);
      }

     await transaction.update({status:updateDto.status})
    
    } catch (error) {
      logger.error('Error updating transaction request status:', error);
      throw error;
    }
  }

  async deleteTransaction(id: number) {
    try {
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new NotFoundError('Transaction');
      }

      const clientWallet = await this.clientWalletRepository.findById(transaction.clientWalletId);
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }

      const newBalance = CalculationHelpers.calculateNewBalance(
        clientWallet.amountInUSD,
        -transaction.amountInUSD,
        'credit'
      );

      await this.clientWalletRepository.updateWalletBalance(transaction.clientWalletId, newBalance);

      const deletedCount = await this.transactionRepository.delete(id);
      
      if (deletedCount) {
        throw new AppError('Failed to delete transaction');
      }

      logger.info(`Transaction deleted: ${id}, wallet balance adjusted`);
      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      throw error;
    }
  }
}