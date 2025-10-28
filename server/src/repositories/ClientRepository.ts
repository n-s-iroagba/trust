// src/repositories/ClientRepository.ts
import AdminWallet from '../models/AdminWallet'
import Client, { ClientCreationAttributes } from '../models/Client'
import ClientWallet from '../models/ClientWallet'
export interface ClientWithWallets extends Client{
  clientWallets:ClientWallet[]
}





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
  



  async getAllClients() {

    const result = await this.findAll({
      include:[{
        model:ClientWallet,
        as:'clientWallets',
        include:[
          {
            model:AdminWallet,
            as:'adminWallet'
          }
        ]
      }]
    }) 
    return result
  }
}

export default ClientRepository