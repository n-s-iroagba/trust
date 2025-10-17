import { Request, Response } from 'express';
import { AdminWalletService, AdminWalletCreationDto, AdminWalletUpdateDto } from '../services/AdminWalletService';
import { ResponseHelpers } from '../services/utils/responseHelpers';
import logger from '../services/logger/winstonLogger';

export class AdminWalletController {
  private adminWalletService: AdminWalletService;

  constructor() {
    this.adminWalletService = new AdminWalletService();
  }

  createAdminWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDto: AdminWalletCreationDto = req.body;
      const adminWallet = await this.adminWalletService.createAdminWallet(createDto);
      
      res.status(201).json(ResponseHelpers.success(adminWallet, 'Admin wallet created successfully'));
    } catch (error: any) {
      logger.error('Create admin wallet error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  updateAdminWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updateDto: AdminWalletUpdateDto = req.body;
      const adminWallet = await this.adminWalletService.updateAdminWallet(id, updateDto);
      
      res.status(200).json(ResponseHelpers.success(adminWallet, 'Admin wallet updated successfully'));
    } catch (error: any) {
      logger.error('Update admin wallet error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getAllAdminWallets = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminWallets = await this.adminWalletService.getAllAdminWallets();
      
      res.status(200).json(ResponseHelpers.success(adminWallets, 'Admin wallets fetched successfully'));
    } catch (error: any) {
      logger.error('Get all admin wallets error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  getAdminWalletById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const adminWallet = await this.adminWalletService.getAdminWalletById(id);
      
      res.status(200).json(ResponseHelpers.success(adminWallet, 'Admin wallet fetched successfully'));
    } catch (error: any) {
      logger.error('Get admin wallet by id error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };

  deleteAdminWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.adminWalletService.deleteAdminWallet(id);
      
      res.status(200).json(ResponseHelpers.success(result, 'Admin wallet deleted successfully'));
    } catch (error: any) {
      logger.error('Delete admin wallet error:', error);
      res.status(error.statusCode || 500).json(ResponseHelpers.error(error.message));
    }
  };
}