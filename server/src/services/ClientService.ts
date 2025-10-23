import Client, { ClientCreationAttributes } from '../models/Client'
import ClientRepository from '../repositories/ClientRepository'
import {BadRequestError, NotFoundError} from './errors/AppError'
import logger from './logger/winstonLogger'
import jwt from 'jsonwebtoken'


export class ClientService {
  private clientRepository: ClientRepository

  constructor() {
    this.clientRepository = new ClientRepository()
  }

  // -------------------------------
  // 🟢 CREATE
  // -------------------------------
  async createClient(ClientData:ClientCreationAttributes): Promise<Client> {
    try {

      const Client = await this.clientRepository.createClient(ClientData)
      logger.info('Client created successfully')

      return Client
    } catch (error) {
      logger.error('Error creating Client'
      )
      throw error
    }
  }

  // -------------------------------
  // 🟣 READ
  // -------------------------------
  async getAllClients(): Promise<Client[]> {
    try {
      const Clients = await this.clientRepository.getAllClients()
      logger.info('Fetched all Clients', { count: Clients.length })
      return Clients
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

  async generateSessionToken(clientId:string|number,passCode:string){

    try{
       const client = await this.clientRepository.findClientById(clientId as number)
       if(client?.signInCode === passCode){

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