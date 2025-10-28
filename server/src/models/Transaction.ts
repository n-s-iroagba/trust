import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import AdminWallet from './AdminWallet';
import ClientWallet from './ClientWallet';

// Define enums for type and status
export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed'
}

interface TransactionAttributes {
  id: number;
  amountInUSD: number;
  clientWalletId: number;
  recipientAddress: string;
  type: TransactionType;
  status: TransactionStatus;
  isAdminCreated: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  declare id: number;
  declare amountInUSD: number;
  declare clientWalletId: number;

  declare recipientAddress: string;
  declare type: TransactionType;
  declare status: TransactionStatus;
  declare isAdminCreated: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
      validate: {
        min: 0.01
      }
    },
    clientWalletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client_wallets',
        key: 'id',
      },
    },

    recipientAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM(TransactionType.DEBIT, TransactionType.CREDIT),
      allowNull: false,
      validate: {
        isIn: [[TransactionType.DEBIT, TransactionType.CREDIT]]
      }
    },
    status: {
      type: DataTypes.ENUM(TransactionStatus.PENDING, TransactionStatus.SUCCESSFUL, TransactionStatus.FAILED),
      allowNull: false,
      defaultValue: TransactionStatus.PENDING,
      validate: {
        isIn: [[TransactionStatus.PENDING, TransactionStatus.SUCCESSFUL, TransactionStatus.FAILED]]
      }
    },

    isAdminCreated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    indexes: [
      {
        fields: ['clientWalletId']
      },
   
      {
        fields: ['status']
      },
      {
        fields: ['type']
      },
   
    ]
  }
);


Transaction.belongsTo(ClientWallet, { 
  foreignKey: 'clientWalletId', 
  as: 'clientWallet' 
});


ClientWallet.hasMany(Transaction, { 
  foreignKey: 'clientWalletId', 
  as: 'transactions' 
});

// ✅ Enums for type and status


export default Transaction;