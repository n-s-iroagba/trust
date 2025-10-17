import { ClientWalletRepository } from '../repositories/ClientWalletRepository';
import { AdminWalletRepository } from '../repositories/AdminWalletRepository';
import { TransactionService } from './TransactionService';
import { AddressGenerator } from './utils/addressGenerator';
import { CalculationHelpers } from './utils/calculationHelpers';
import { ValidationHelpers } from './utils/validationHelpers';
import { AppError, NotFoundError, ConflictError } from './errors/AppError';
import logger from './logger/winstonLogger';

export interface ClientWalletCreationDto {
  adminWalletId: number;
  clientId: string;
}

export interface CreditDebitDto {
  amountInUSD: number;
  adminWalletId: number;
}

export class ClientWalletService {
  private clientWalletRepository: ClientWalletRepository;
  private adminWalletRepository: AdminWalletRepository;
  private transactionService: TransactionService;

  constructor() {
    this.clientWalletRepository = new ClientWalletRepository();
    this.adminWalletRepository = new AdminWalletRepository();
    this.transactionService = new TransactionService();
  }

  async createClientWallet(createDto: ClientWalletCreationDto) {
    try {
      if (!ValidationHelpers.isValidClientId(createDto.clientId)) {
        throw new AppError('Invalid client ID', 400);
      }

      const adminWallet = await this.adminWalletRepository.findById(createDto.adminWalletId);
      if (!adminWallet) {
        throw new NotFoundError('Admin wallet');
      }

      const existingWallet = await this.clientWalletRepository.findByClientIdAndAdminWalletId(
        createDto.clientId,
        createDto.adminWalletId
      );
      if (existingWallet) {
        throw new ConflictError('Client wallet already exists for this admin wallet');
      }

      const address = AddressGenerator.generateClientWalletAddress();
      
      const clientWalletData = {
        ...createDto,
        address,
        amountInUSD: 0
      };

      const clientWallet = await this.clientWalletRepository.create(clientWalletData);
      logger.info(`Client wallet created: ${clientWallet.id} for client: ${createDto.clientId}`);
      
      return clientWallet;
    } catch (error) {
      logger.error('Error creating client wallet:', error);
      throw error;
    }
  }

  async getAllClientWallets() {
    try {
      return await this.clientWalletRepository.findAllWithAdminWalletAndClient();
    } catch (error) {
      logger.error('Error fetching all client wallets:', error);
      throw error;
    }
  }

  async getClientWalletsByClientId(clientId: string) {
    try {
      if (!ValidationHelpers.isValidClientId(clientId)) {
        throw new AppError('Invalid client ID', 400);
      }

      return await this.clientWalletRepository.findAllByClientIdWithAdminWallet(clientId);
    } catch (error) {
      logger.error('Error fetching client wallets by client ID:', error);
      throw error;
    }
  }

  async getClientWalletById(id: number) {
    try {
      const clientWallet = await this.clientWalletRepository.findByIdWithClientAndAdminWallet(id);
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }
      return clientWallet;
    } catch (error) {
      logger.error('Error fetching client wallet by id:', error);
      throw error;
    }
  }

  async creditWallet(clientWalletId: number, creditDto: CreditDebitDto) {
    try {
      const clientWallet = await this.clientWalletRepository.findById(clientWalletId);
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }

      if (!CalculationHelpers.isValidAmount(creditDto.amountInUSD)) {
        throw new AppError('Invalid amount', 400);
      }

      const newBalance = CalculationHelpers.calculateNewBalance(
        clientWallet.amountInUSD,
        creditDto.amountInUSD,
        'credit'
      );

      await this.clientWalletRepository.updateWalletBalance(clientWalletId, newBalance);

      const transaction = await this.transactionService.createTransaction({
        amountInUSD: creditDto.amountInUSD,
        clientWalletId,
        adminWalletId: creditDto.adminWalletId
      });

      logger.info(`Wallet credited: ${clientWalletId}, amount: ${creditDto.amountInUSD}`);
      
      return {
        clientWallet: await this.clientWalletRepository.findById(clientWalletId),
        transaction
      };
    } catch (error) {
      logger.error('Error crediting wallet:', error);
      throw error;
    }
  }

  async debitWallet(clientWalletId: number, debitDto: CreditDebitDto) {
    try {
      const clientWallet = await this.clientWalletRepository.findById(clientWalletId);
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }

      if (!CalculationHelpers.isValidAmount(debitDto.amountInUSD)) {
        throw new AppError('Invalid amount', 400);
      }

      const newBalance = CalculationHelpers.calculateNewBalance(
        clientWallet.amountInUSD,
        debitDto.amountInUSD,
        'debit'
      );

      await this.clientWalletRepository.updateWalletBalance(clientWalletId, newBalance);

      const transaction = await this.transactionService.createTransaction({
        amountInUSD: -debitDto.amountInUSD,
        clientWalletId,
        adminWalletId: debitDto.adminWalletId
      });

      logger.info(`Wallet debited: ${clientWalletId}, amount: ${debitDto.amountInUSD}`);
      
      return {
        clientWallet: await this.clientWalletRepository.findById(clientWalletId),
        transaction
      };
    } catch (error) {
      logger.error('Error debiting wallet:', error);
      throw error;
    }
  }
}