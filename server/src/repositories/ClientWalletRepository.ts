import { ModelStatic, FindOptions } from 'sequelize';
import ClientWallet from '../models/ClientWallet';
import { BaseRepository } from './BaseRepository';

export class ClientWalletRepository extends BaseRepository<ClientWallet> {
  constructor() {
    super(ClientWallet as ModelStatic<ClientWallet>);
  }

  async findAllWithAdminWalletAndClient(): Promise<ClientWallet[]> {
    return this.findAll({
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
      ]
    });
  }

  async findAllByClientIdWithAdminWallet(clientId: string): Promise<ClientWallet[]> {
    return this.findAll({
      where: { clientId },
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
      ]
    });
  }

  async findByIdWithClientAndAdminWallet(id: number): Promise<ClientWallet | null> {
    return this.findById(id, {
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
      ]
    });
  }

  async findByAddress(address: string): Promise<ClientWallet | null> {
    return this.findOne({ 
      where: { address },
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
      ]
    });
  }

  async findByClientIdAndAdminWalletId(clientId: string, adminWalletId: number): Promise<ClientWallet | null> {
    return this.findOne({ 
      where: { clientId, adminWalletId },
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
      ]
    });
  }

  async updateWalletBalance(id: number, newBalance: number): Promise<[number, ClientWallet[]]> {
    return this.update(
      { amountInUSD: newBalance },
      { where: { id } }
    );
  }
}