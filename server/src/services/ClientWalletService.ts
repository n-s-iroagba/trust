import { ClientWalletRepository } from '../repositories/ClientWalletRepository';
import { AdminWalletRepository } from '../repositories/AdminWalletRepository';
import { TransactionService } from './TransactionService';
import { CalculationHelpers } from './utils/calculationHelpers';
import { ValidationHelpers } from './utils/validationHelpers';
import { AppError, NotFoundError, ConflictError } from './errors/AppError';
import logger from './logger/winstonLogger';
import Client from '../models/Client';
import Transaction from '../models/Transaction';
import { ClientWalletCreationAttributes } from '../models/ClientWallet';

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
      
      const clientWalletData = {
        ...createDto,
        address:adminWallet.clientReceivingAddress,
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
  async initClientWallets(clientId:number|string) {
    try {
  

      const adminWallets = await this.adminWalletRepository.findAll();
 
      

      for (const wallet of adminWallets){
      const clientWalletData:ClientWalletCreationAttributes = {
        adminWalletId:wallet.id,
        clientId:clientId as string,
        address:wallet.clientReceivingAddress,
        amountInUSD: 0
      };

  await this.clientWalletRepository.create(clientWalletData);
    }
      logger.info(`Client walleta initialised`);
      

    } catch (error) {
      logger.error('Error creating client wallet:', error);
      throw error;
    }
  }
  async getAllClientWallets(clientId:string) {
    try {
      return await this.clientWalletRepository.findAll({where:{clientId}});
    } catch (error) {
      logger.error('Error fetching all client wallets:', error);
      throw error;
    }
  }



  async getClientWalletById(id: number) {
    try {
      const clientWallet = await this.clientWalletRepository.findAll({
        where:{id},
        include:[
          {
            model:Client,as:'client'
          },
          {
            model:Transaction, as: 'transactions'
          }
        ]
      });
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }
      return clientWallet;
    } catch (error) {
      logger.error('Error fetching client wallet by id:', error);
      throw error;
    }
  }

  async creditWallet(clientWalletId: number, amount:number) {
    try {
      const clientWallet = await this.clientWalletRepository.findById(clientWalletId);
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }
      const newBalance = CalculationHelpers.calculateNewBalance(
        clientWallet.amountInUSD,
        amount,
        'credit'
      );
      await this.clientWalletRepository.updateWalletBalance(clientWalletId, newBalance);
      logger.info(`Wallet credited: ${clientWalletId}, amount: ${amount}`);
      return  
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