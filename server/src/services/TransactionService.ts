import { TransactionRepository } from '../repositories/TransactionRepository';
import { ClientWalletRepository } from '../repositories/ClientWalletRepository';
import { CalculationHelpers } from './utils/calculationHelpers';
import { ValidationHelpers } from './utils/validationHelpers';
import { AppError, NotFoundError } from './errors/AppError';
import logger from './logger/winstonLogger';

export interface TransactionCreationDto {
  amountInUSD: number;
  clientWalletId: number;
  adminWalletId: number;
}

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private clientWalletRepository: ClientWalletRepository;

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

  async getAllTransactionsWithAdminWalletByClientWalletId(clientWalletId: number) {
    try {
      return await this.transactionRepository.findAllWithAdminWalletByClientWalletId(clientWalletId);
    } catch (error) {
      logger.error('Error fetching transactions by client wallet ID:', error);
      throw error;
    }
  }

  async getAllTransactionsByAdminWalletId(adminWalletId: number) {
    try {
      return await this.transactionRepository.findAllByAdminWalletIdWithClientWalletAndAdminWallet(adminWalletId);
    } catch (error) {
      logger.error('Error fetching transactions by admin wallet ID:', error);
      throw error;
    }
  }

  async getAllTransactions() {
    try {
      return await this.transactionRepository.findAllWithAssociations();
    } catch (error) {
      logger.error('Error fetching all transactions:', error);
      throw error;
    }
  }

  async getTransactionById(id: number) {
    try {
      const transaction = await this.transactionRepository.findByIdWithAssociations(id);
      if (!transaction) {
        throw new NotFoundError('Transaction');
      }
      return transaction;
    } catch (error) {
      logger.error('Error fetching transaction by id:', error);
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

      const deletedCount = await this.transactionRepository.delete({ where: { id } });
      
      if (deletedCount === 0) {
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