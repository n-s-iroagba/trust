import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';
import ClientWallet from './ClientWallet';

interface TransactionRequestAttributes {
  id: number;
  clientWalletId: number;
  amountInUSD: number;
  status: 'pending' | 'successful' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionRequestCreationAttributes extends Optional<TransactionRequestAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class TransactionRequest extends Model<TransactionRequestAttributes, TransactionRequestCreationAttributes> implements TransactionRequestAttributes {
  public id!: number;
  public clientWalletId!: number;
  public amountInUSD!: number;
  public status!: 'pending' | 'successful' | 'failed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TransactionRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientWalletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client_wallets',
        key: 'id',
      },
    },
    amountInUSD: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'successful', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
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
    modelName: 'TransactionRequest',
    tableName: 'transaction_requests',
  }
);

// Define associations
TransactionRequest.belongsTo(ClientWallet, { foreignKey: 'clientWalletId', as: 'clientWallet' });
ClientWallet.hasMany(TransactionRequest, { foreignKey: 'clientWalletId', as: 'transactionRequests' });

export default TransactionRequest;