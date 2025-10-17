import { Request, Response } from 'express';
import { ClientWalletService, ClientWalletCreationDto, CreditDebitDto } from '../services/ClientWalletService';
import { ResponseHelpers } from '../services/utils/responseHelpers';
import logger from '../services/logger/winstonLogger';

export class ClientWalletController {
  private clientWalletService: ClientWalletService;

  constructor() {
    this.clientWalletService = new ClientWalletService();
  }

  createClientWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDto: ClientWalletCreationDto = req.body;
      const clientWallet = await this.clientWalletService.createClientWallet(createDto);
      
      res.status(201).json(ResponseHelpers.success(clientWallet, 'Client wallet created successfully'));
    } catch (error: any) {
      logger.error('Create client wallet error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getAllClientWallets = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientWallets = await this.clientWalletService.getAllClientWallets();
      
      res.status(200).json(ResponseHelpers.success(clientWallets, 'Client wallets fetched successfully'));
    } catch (error: any) {
      logger.error('Get all client wallets error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getClientWalletsByClientId = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = req.params.clientId;
      const clientWallets = await this.clientWalletService.getClientWalletsByClientId(clientId);
      
      res.status(200).json(ResponseHelpers.success(clientWallets, 'Client wallets fetched successfully'));
    } catch (error: any) {
      logger.error('Get client wallets by client ID error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getClientWalletById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const clientWallet = await this.clientWalletService.getClientWalletById(id);
      
      res.status(200).json(ResponseHelpers.success(clientWallet, 'Client wallet fetched successfully'));
    } catch (error: any) {
      logger.error('Get client wallet by id error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  creditWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientWalletId = parseInt(req.params.id);
      const creditDto: CreditDebitDto = req.body;
      const result = await this.clientWalletService.creditWallet(clientWalletId, creditDto);
      
      res.status(200).json(ResponseHelpers.success(result, 'Wallet credited successfully'));
    } catch (error: any) {
      logger.error('Credit wallet error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  debitWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientWalletId = parseInt(req.params.id);
      const debitDto: CreditDebitDto = req.body;
      const result = await this.clientWalletService.debitWallet(clientWalletId, debitDto);
      
      res.status(200).json(ResponseHelpers.success(result, 'Wallet debited successfully'));
    } catch (error: any) {
      logger.error('Debit wallet error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };
}