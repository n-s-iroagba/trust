import Client, { ClientCreationAttributes } from '../models/Client'
import { AdminWalletRepository } from '../repositories/AdminWalletRepository'
import ClientRepository from '../repositories/ClientRepository'
import { ClientWalletService } from '../services/ClientWalletService'
import {BadRequestError, NotFoundError} from './errors/AppError'
import logger from './logger/winstonLogger'
import jwt from 'jsonwebtoken'


export class ClientService {
  private clientRepository: ClientRepository
  private adminWalletRepository:AdminWalletRepository
  private clientWalletService:ClientWalletService
  

  constructor() {
    this.clientRepository = new ClientRepository()
    this. adminWalletRepository = new AdminWalletRepository()
    this.clientWalletService = new ClientWalletService()

  }

  // -------------------------------
  // 🟢 CREATE
  // -------------------------------
async createClient(ClientData: ClientCreationAttributes): Promise<Client> {
  try {
    // Step 1: Create the client
    const client = await this.clientRepository.createClient(ClientData);
    await this.clientWalletService.initClientWallets(client.id)


    logger.info('Client created successfully with associated wallets');

    return client;
  } catch (error) {
    logger.error('Error creating client:', error);
    throw error;
  }

  }

  // -------------------------------
  // 🟣 READ
  // -------------------------------
  async getAllClients(): Promise<Client[]> {
    try {
      const clients = await this.clientRepository.getAllClients()
      logger.info('Fetched all Clients', { count: clients.length })
      return clients
    } catch (error) {
      logger.error('Error fetching Clients', { error })
      throw error
    }
  }

  async findClientById(id: string | number): Promise<Client> {
    try {
      const client = await this.clientRepository.findClientById(id as number)
      if (!client) {
        logger.warn('client not found by ID', { ClientId: id })
        throw new NotFoundError('Client_NOT_FOUND')
      }
      logger.info('client found by ID', { ClientId: id })
      return client
    } catch (error) {
      logger.error('Error finding client by ID', { ClientId: id, error })
      throw error
    }
  }

  async generateSessionToken(clientId:string|number,pin:string){

    try{
       const client = await this.clientRepository.findClientById(clientId as number)
       if(client?.pin === pin){

       const token = jwt.sign('sessionToken',null)
       return {token}
       }else{
        throw new BadRequestError('bad request error')
       }

    }catch(error){
      console.error('Error generating session token')

    }
  }

  // -------------------------------
  // 🔴 DELETE
  // -------------------------------
  async deleteClient(id: string 
  ): Promise<boolean> {
    try {
      const deleted = await this.clientRepository.delete(id)
      if (!deleted) {
        throw new NotFoundError('Client_NOT_FOUND')
      }
      logger.info('Client deleted successfully', { ClientId: id })
      return true
    } catch (error) {
      logger.error('Error deleting Client', { ClientId: id, error })
      throw error
    }
  }



}