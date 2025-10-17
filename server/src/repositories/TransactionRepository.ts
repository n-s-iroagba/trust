import { ModelStatic, FindOptions } from 'sequelize';
import Transaction from '../models/Transaction';
import { BaseRepository } from './BaseRepository';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super(Transaction as ModelStatic<Transaction>);
  }

  async findAllWithAdminWalletByClientWalletId(clientWalletId: number): Promise<Transaction[]> {
    return this.findAll({
      where: { clientWalletId },
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] }
      ]
    });
  }

  async findAllByAdminWalletIdWithClientWalletAndAdminWallet(adminWalletId: number): Promise<Transaction[]> {
    return this.findAll({
      where: { adminWalletId },
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] },
        { association: 'clientWallet', attributes: ['id', 'clientId', 'address', 'amountInUSD'] }
      ]
    });
  }

  async findAllWithAssociations(): Promise<Transaction[]> {
    return this.findAll({
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] },
        { association: 'clientWallet', attributes: ['id', 'clientId', 'address', 'amountInUSD'] }
      ]
    });
  }

  async findByIdWithAssociations(id: number): Promise<Transaction | null> {
    return this.findById(id, {
      include: [
        { association: 'adminWallet', attributes: ['id', 'currencyAbbreviation', 'logo', 'address', 'currency'] },
        { association: 'clientWallet', attributes: ['id', 'clientId', 'address', 'amountInUSD'] }
      ]
    });
  }

  async findByClientWalletId(clientWalletId: number): Promise<Transaction[]> {
    return this.findAll({
      where: { clientWalletId }
    });
  }
}