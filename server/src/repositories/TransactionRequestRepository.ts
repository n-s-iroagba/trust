import { ModelStatic, FindOptions } from 'sequelize';
import TransactionRequest from '../models/TransactionRequest';
import { BaseRepository } from './BaseRepository';

export class TransactionRequestRepository extends BaseRepository<TransactionRequest> {
  constructor() {
    super(TransactionRequest as ModelStatic<TransactionRequest>);
  }

  async findByIdWithAdminWalletAndClientWallet(id: number): Promise<TransactionRequest | null> {
    return this.findById(id, {
      include: [
        { 
          association: 'clientWallet',
          include: [
            { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
          ]
        }
      ]
    });
  }

  async findAllByClientWalletIdWithAdminWalletAndClientWallet(clientWalletId: number): Promise<TransactionRequest[]> {
    return this.findAll({
      where: { clientWalletId },
      include: [
        { 
          association: 'clientWallet',
          include: [
            { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
          ]
        }
      ]
    });
  }

  async findAllByStatus(status: 'pending' | 'successful' | 'failed'): Promise<TransactionRequest[]> {
    return this.findAll({
      where: { status },
      include: [
        { 
          association: 'clientWallet',
          include: [
            { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
          ]
        }
      ]
    });
  }

  async updateStatus(id: number, status: 'pending' | 'successful' | 'failed'): Promise<[number, TransactionRequest[]]> {
    return this.update(
      { status },
      { where: { id } }
    );
  }

  async findByClientWalletIdAndStatus(clientWalletId: number, status: string): Promise<TransactionRequest[]> {
    return this.findAll({
      where: { clientWalletId, status }
    });
  }
}