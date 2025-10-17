import { ModelStatic, FindOptions } from 'sequelize';
import AdminWallet from '../models/AdminWallet';
import { BaseRepository } from './BaseRepository';

export class AdminWalletRepository extends BaseRepository<AdminWallet> {
  constructor() {
    super(AdminWallet as ModelStatic<AdminWallet>);
  }

  async findAllWithAssociations(): Promise<AdminWallet[]> {
    return this.findAll();
  }

  async findByIdWithAssociations(id: number): Promise<AdminWallet | null> {
    return this.findById(id);
  }

  async findByAddress(address: string): Promise<AdminWallet | null> {
    return this.findOne({ where: { address } });
  }

  async checkIfHasClientWallets(adminWalletId: number): Promise<boolean> {
    const count = await this.model.sequelize?.models.ClientWallet.count({
      where: { adminWalletId }
    });
    return count ? count > 0 : false;
  }
}