import { ModelStatic, FindOptions } from 'sequelize';
import Transaction from '../models/Transaction';
import { BaseRepository } from './BaseRepository';
import AdminWallet from '../models/AdminWallet';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super(Transaction as ModelStatic<Transaction>);
  }

}