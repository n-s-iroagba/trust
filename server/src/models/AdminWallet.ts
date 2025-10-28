import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';

interface AdminWalletAttributes {
  id: number;
  currencyAbbreviation: string;
  logo: string;
  clientReceivingAddress:string
  address:string;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdminWalletCreationAttributes extends Optional<AdminWalletAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class AdminWallet extends Model<AdminWalletAttributes, AdminWalletCreationAttributes> {
  declare id: number;
  declare currencyAbbreviation: string;
  declare clientReceivingAddress:string;
  declare address:string;
  declare logo: string;
  declare currency: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
  clientReceivingAddress: { 
      type: DataTypes.STRING,
      allowNull: false,
  
  },
    address: { 
      type: DataTypes.STRING,
      allowNull: false,
  
  },
},
  {
    sequelize,
    modelName: 'AdminWallet',
    tableName: 'admin_wallets',
  }
);

export default AdminWallet;