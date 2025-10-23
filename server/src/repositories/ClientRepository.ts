// src/repositories/ClientRepository.ts




import Client, { ClientCreationAttributes } from '../models/Client'

import {BaseRepository} from './BaseRepository'

class ClientRepository extends BaseRepository<Client> {
  constructor() {
    super(Client)
  }

  async createClient(ClientData: ClientCreationAttributes): Promise<Client> {
    return await this.create(ClientData)
  }


  async findClientById(id: number): Promise<Client | null> {
 
    return await this.findById(id) as Client | null
  }
  



  async getAllClients(): Promise<Client[]> {

    const result = await this.findAll()
    return result
  }
}

export default ClientRepository