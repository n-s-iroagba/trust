import { Request, Response } from 'express';
import { TransactionService, TransactionCreationDto } from '../services/TransactionService';
import { ResponseHelpers } from '../services/utils/responseHelpers';
import logger from '../services/logger/winstonLogger';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  createTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDto: TransactionCreationDto = req.body;
      const transaction = await this.transactionService.createTransaction(createDto);
      
      res.status(201).json(ResponseHelpers.success(transaction, 'Transaction created successfully'));
    } catch (error: any) {
      logger.error('Create transaction error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getTransactionsByClientWalletId = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientWalletId = parseInt(req.params.clientWalletId);
      const transactions = await this.transactionService.getAllTransactionsWithAdminWalletByClientWalletId(clientWalletId);
      
      res.status(200).json(ResponseHelpers.success(transactions, 'Transactions fetched successfully'));
    } catch (error: any) {
      logger.error('Get transactions by client wallet ID error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getTransactionsByAdminWalletId = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminWalletId = parseInt(req.params.adminWalletId);
      const transactions = await this.transactionService.getAllTransactionsByAdminWalletId(adminWalletId);
      
      res.status(200).json(ResponseHelpers.success(transactions, 'Transactions fetched successfully'));
    } catch (error: any) {
      logger.error('Get transactions by admin wallet ID error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getAllTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactions = await this.transactionService.getAllTransactions();
      
      res.status(200).json(ResponseHelpers.success(transactions, 'Transactions fetched successfully'));
    } catch (error: any) {
      logger.error('Get all transactions error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await this.transactionService.getTransactionById(id);
      
      res.status(200).json(ResponseHelpers.success(transaction, 'Transaction fetched successfully'));
    } catch (error: any) {
      logger.error('Get transaction by id error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.transactionService.deleteTransaction(id);
      
      res.status(200).json(ResponseHelpers.success(result, 'Transaction deleted successfully'));
    } catch (error: any) {
      logger.error('Delete transaction error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };
}