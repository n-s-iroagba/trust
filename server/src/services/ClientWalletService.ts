import { ClientWalletRepository } from '../repositories/ClientWalletRepository';
import { AdminWalletRepository } from '../repositories/AdminWalletRepository';
import { TransactionService } from './TransactionService';
import { CalculationHelpers } from './utils/calculationHelpers';
import { ValidationHelpers } from './utils/validationHelpers';
import { AppError, NotFoundError, ConflictError } from './errors/AppError';
import logger from './logger/winstonLogger';
import Client from '../models/Client';
import Transaction, { TransactionStatus, TransactionType } from '../models/Transaction';
import { ClientWalletCreationAttributes } from '../models/ClientWallet';
import AdminWallet from '../models/AdminWallet';

export interface ClientWalletCreationDto {
  adminWalletId: number;
  clientId: string;
}

export interface CreditDebitDto {
  amountInUSD: number;
  clientWalletId: number;
  recipientAddress: string;
  type: TransactionType;
  status?: TransactionStatus;
  isAdminCreated: boolean;
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
  async initClientWallets(clientId:number) {
    try {
  

      const adminWallets = await this.adminWalletRepository.findAll();
 
      

      for (const wallet of adminWallets){
      const clientWalletData:ClientWalletCreationAttributes = {
        adminWalletId:wallet.id,
        clientId:clientId,
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
      return await this.clientWalletRepository.findAll({where:{clientId},
       include:[{
        model:AdminWallet,
        as:'adminWallet'
       }]
      });
    } catch (error) {
      logger.error('Error fetching all client wallets:', error);
      throw error;
    }
  }
  async getAll() {
    try {
      return await this.clientWalletRepository.findAll();
    } catch (error) {
      logger.error('Error fetching all client wallets:', error);
      throw error;
    }
  }


  async getClientWalletById(id: number) {
    try {
      const clientWallet = await this.clientWalletRepository.findOne({
        where:{id},
        include:[
          {
            model:Client,as:'client'
          },
          {
            model:Transaction, as: 'transactions'
          },
          {
            model:AdminWallet, as: 'adminWallet'
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

  async creditWallet(clientWalletId: number, dto:CreditDebitDto) {
    try {
      const clientWallet = await this.clientWalletRepository.findById(clientWalletId);
      if (!clientWallet) {
        throw new NotFoundError('Client wallet');
      }
         await Transaction.create({
      ...dto,
      status:dto.status?dto.status:TransactionStatus.PENDING
     
      });
 
      if(dto.isAdminCreated){
               const newBalance = CalculationHelpers.calculateNewBalance(
     clientWallet.amountInUSD,
          Number( dto.amountInUSD),
        dto.type
      );
         await this.clientWalletRepository.updateWalletBalance(clientWalletId, newBalance);
      }
   
    
      logger.info(`Wallet credited: ${clientWalletId}`);
      return  
    } catch (error) {
      logger.error('Error crediting wallet:', error);
      throw error;
    }
  }


}