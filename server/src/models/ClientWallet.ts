import { DataTypes, Model, Optional } from 'sequelize';
import AdminWallet from './AdminWallet';
import Client from './Client';
import sequelize from '../config/database';

interface ClientWalletAttributes {
  id: number;
  adminWalletId: number;
  clientId: number;
  address: string;
  amountInUSD: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientWalletCreationAttributes
  extends Optional<ClientWalletAttributes, 'id' | 'amountInUSD' | 'createdAt' | 'updatedAt'> {}

class ClientWallet
  extends Model<ClientWalletAttributes, ClientWalletCreationAttributes>
  
{
  declare id: number;
  declare adminWalletId: number;
  declare clientId: string;
  declare address: string;
  declare amountInUSD: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ClientWallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adminWalletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_wallets',
        key: 'id',
      },
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amountInUSD: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
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
    modelName: 'ClientWallet',
    tableName: 'client_wallets',
  }
);

// ✅ Associations
ClientWallet.belongsTo(AdminWallet, { foreignKey: 'adminWalletId', as: 'adminWallet' });
Client.hasMany(ClientWallet, { foreignKey: 'clientId', as: 'clientWallets' });
ClientWallet.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

export default ClientWallet;
