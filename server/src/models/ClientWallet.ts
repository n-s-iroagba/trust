import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';
import AdminWallet from './AdminWallet';
import Client from './Client';

interface ClientWalletAttributes {
  id: number;
  adminWalletId: number;
  clientId: string;
  address: string;
  amountInUSD: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ClientWalletCreationAttributes extends Optional<ClientWalletAttributes, 'id' | 'amountInUSD' | 'createdAt' | 'updatedAt'> {}

class ClientWallet extends Model<ClientWalletAttributes, ClientWalletCreationAttributes> implements ClientWalletAttributes {
  public id!: number;
  public adminWalletId!: number;
  public clientId!: string;
  public address!: string;
  public amountInUSD!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      type: DataTypes.STRING,
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
      defaultValue: 0.00,
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

// Define associations
ClientWallet.belongsTo(AdminWallet, { foreignKey: 'adminWalletId', as: 'adminWallet' });
Client.hasMany(ClientWallet, { foreignKey: 'client', as: 'clientWallets' });

export default ClientWallet;