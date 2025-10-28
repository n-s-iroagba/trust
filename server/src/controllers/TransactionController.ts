import { Request, Response } from 'express';
import { TransactionService, TransactionCreationDto } from '../services/TransactionService';
import { ResponseHelpers } from '../services/utils/responseHelpers';
import logger from '../services/logger/winstonLogger';
import Transaction, { TransactionCreationAttributes, TransactionStatus } from '../models/Transaction';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  createTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDto: TransactionCreationAttributes = req.body;
      const transaction = await this.transactionService.createTransaction(createDto);
      
      res.status(201).json(ResponseHelpers.success(transaction, 'Transaction created successfully'));
    } catch (error: any) {
      logger.error('Create transaction error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };
    updateTransactionStatus = async (req: Request, res: Response): Promise<void> => {
      const id = parseInt(req.params.id)
    try {

      const transaction = await this.transactionService.updateTransactionStatus(id,req.body);
      
      res.status(201).json(ResponseHelpers.success(transaction, 'Transaction status updated successfully'));
    } catch (error: any) {
      logger.error('Create transaction error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };
      updateTransaction = async (req: Request, res: Response): Promise<void> => {
      const id = parseInt(req.params.id)
    try {

      const transaction = await this.transactionService.updateTransaction(id,req.body);
      
      res.status(201).json(ResponseHelpers.success(transaction, 'Transaction status updated successfully'));
    } catch (error: any) {
      logger.error('Create transaction error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getTransactionsByClientWalletId = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientWalletId = parseInt(req.params.clientWalletId);
      const transactions = await this.transactionService.getTransactionsByClientWalletId(clientWalletId);
      
      res.status(200).json(ResponseHelpers.success(transactions, 'Transactions fetched successfully'));
    } catch (error: any) {
      logger.error('Get transactions by client wallet ID error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };
  getPending = async (req: Request, res: Response): Promise<void> => {
    try {
  
      const transactions = await Transaction.findAll({where:{status:TransactionStatus.PENDING}});
      
      res.status(200).json(ResponseHelpers.success(transactions, 'Transactions fetched successfully'));
    } catch (error: any) {
      logger.error('Get transactions by client wallet ID error:', error);
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