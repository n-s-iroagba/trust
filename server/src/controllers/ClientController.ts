import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';
import { ClientWithWallets } from '../repositories/ClientRepository';
import { NotFoundError, BadRequestError } from '../services/errors/AppError';
import logger from '../services/logger/winstonLogger';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }



  // 🟣 GET ALL CLIENTS
  async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.clientService.getAllClients();
      
      res.status(200).json({
        success: true,
        message: 'Clients retrieved successfully',
        data: clients,
        count: clients.length
      });

    } catch (error) {
      logger.error('Error in getAllClients controller:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching clients'
      });
    }
  }

  // 🟣 GET CLIENT BY ID
  async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Client ID is required'
        });
        return;
      }

      const client = await this.clientService.findClientById(id);
      
      res.status(200).json({
        success: true,
        message: 'Client retrieved successfully',
        data: client
      });

    } catch (error) {
      logger.error('Error in getClientById controller:', error);
      
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error while fetching client'
        });
      }
    }
  }

  // 🟣 GET CLIENT WALLETS
  async getClientWallets(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;

      if (!clientId) {
        res.status(400).json({
          success: false,
          message: 'Client ID is required'
        });
        return;
      }

      // First get the client to ensure it exists and has wallets
      const client = (await this.clientService.findClientById(clientId)) as unknown as ClientWithWallets;
      
      res.status(200).json({
        success: true,
        message: 'Client wallets retrieved successfully',
        data: {
          client: {
            id: client.id,
            firstName: client.firstName,
            lastName: client.lastName
          },
          clientWallets: client?.clientWallets || []
        },
        count: client.clientWallets?.length || 0
      });

    } catch (error) {
      logger.error('Error in getClientWallets controller:', error);
      
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error while fetching client wallets'
        });
      }
    }
  }

  // 🔵 GENERATE SESSION TOKEN
  async generateSessionToken(req: Request, res: Response): Promise<void> {
    try {
      const { clientId, pin } = req.body;

      if (!clientId || !pin) {
        res.status(400).json({
          success: false,
          message: 'clientId and pin are required'
        });
        return;
      }

      const result = await this.clientService.generateSessionToken(clientId, pin);
      
      res.status(200).json({
        success: true,
        message: 'Session token generated successfully',
        data: result
      });

    } catch (error) {
      logger.error('Error in generateSessionToken controller:', error);
      
      if (error instanceof BadRequestError) {
        res.status(400).json({
          success: false,
          message: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error while generating session token'
        });
      }
    }
  }

  // 🔴 DELETE CLIENT
  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Client ID is required'
        });
        return;
      }

      const deleted = await this.clientService.deleteClient(id);
      
      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Client deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

    } catch (error) {
      logger.error('Error in deleteClient controller:', error);
      
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error while deleting client'
        });
      }
    }
  }

  // 🟡 UPDATE CLIENT (Optional - if you need update functionality)
  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Client ID is required'
        });
        return;
      }

      // Ensure the client exists first
      await this.clientService.findClientById(id);

      // Here you would typically call an update method in your service
      // For now, we'll return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Client update endpoint - implement update logic in service',
        data: { id, ...updateData }
      });

    } catch (error) {
      logger.error('Error in updateClient controller:', error);
      
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error while updating client'
        });
      }
    }
  }
}

// Export singleton instance
export const clientController = new ClientController();