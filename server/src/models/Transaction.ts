import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';
import AdminWallet from './AdminWallet';
import ClientWallet from './ClientWallet';

interface TransactionAttributes {
  id: number;
  amountInUSD: number;
  clientWalletId: number;
  adminWalletId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public amountInUSD!: number;
  public clientWalletId!: number;
  public adminWalletId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amountInUSD: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    clientWalletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client_wallets',
        key: 'id',
      },
    },
    adminWalletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_wallets',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
  }
);

// Define associations
Transaction.belongsTo(AdminWallet, { foreignKey: 'adminWalletId', as: 'adminWallet' });
Transaction.belongsTo(ClientWallet, { foreignKey: 'clientWalletId', as: 'clientWallet' });
AdminWallet.hasMany(Transaction, { foreignKey: 'adminWalletId', as: 'transactions' });
ClientWallet.hasMany(Transaction, { foreignKey: 'clientWalletId', as: 'transactions' });

export default Transaction;