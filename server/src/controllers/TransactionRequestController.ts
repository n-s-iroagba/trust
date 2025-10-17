import { Request, Response } from 'express';
import { TransactionRequestService, TransactionRequestCreationDto, UpdateStatusDto } from '../services/TransactionRequestService';
import { ResponseHelpers } from '../services/utils/responseHelpers';
import logger from '../services/logger/winstonLogger';

export class TransactionRequestController {
  private transactionRequestService: TransactionRequestService;

  constructor() {
    this.transactionRequestService = new TransactionRequestService();
  }

  createTransactionRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDto: TransactionRequestCreationDto = req.body;
      const transactionRequest = await this.transactionRequestService.createTransactionRequest(createDto);
      
      res.status(201).json(ResponseHelpers.success(transactionRequest, 'Transaction request created successfully'));
    } catch (error: any) {
      logger.error('Create transaction request error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  updateTransactionRequestStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updateDto: UpdateStatusDto = req.body;
      const transactionRequest = await this.transactionRequestService.updateTransactionRequestStatus(id, updateDto);
      
      res.status(200).json(ResponseHelpers.success(transactionRequest, 'Transaction request status updated successfully'));
    } catch (error: any) {
      logger.error('Update transaction request status error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getTransactionRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const transactionRequest = await this.transactionRequestService.getTransactionRequestById(id);
      
      res.status(200).json(ResponseHelpers.success(transactionRequest, 'Transaction request fetched successfully'));
    } catch (error: any) {
      logger.error('Get transaction request by id error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getTransactionRequestsByClientWalletId = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientWalletId = parseInt(req.params.clientWalletId);
      const transactionRequests = await this.transactionRequestService.getTransactionRequestsByClientWalletId(clientWalletId);
      
      res.status(200).json(ResponseHelpers.success(transactionRequests, 'Transaction requests fetched successfully'));
    } catch (error: any) {
      logger.error('Get transaction requests by client wallet ID error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getTransactionRequestsByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.params.status as 'pending' | 'successful' | 'failed';
      const transactionRequests = await this.transactionRequestService.getTransactionRequestsByStatus(status);
      
      res.status(200).json(ResponseHelpers.success(transactionRequests, 'Transaction requests fetched successfully'));
    } catch (error: any) {
      logger.error('Get transaction requests by status error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };
}