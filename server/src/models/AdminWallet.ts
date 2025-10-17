import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

interface AdminWalletAttributes {
  id: number;
  currencyAbbreviation: string;
  logo: string;
  address: string;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdminWalletCreationAttributes extends Optional<AdminWalletAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class AdminWallet extends Model<AdminWalletAttributes, AdminWalletCreationAttributes> implements AdminWalletAttributes {
  public id!: number;
  public currencyAbbreviation!: string;
  public logo!: string;
  public address!: string;
  public currency!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdminWallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    currencyAbbreviation: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    currency: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
    modelName: 'AdminWallet',
    tableName: 'admin_wallets',
  }
);

export default AdminWallet;