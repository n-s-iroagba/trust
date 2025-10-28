import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Role } from '../types/auth.types';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  verificationCode?: string | null;
  verificationToken?: string | null;
  passwordResetToken?: string | null;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'isEmailVerified'
    | 'verificationCode'
    | 'verificationToken'
    | 'passwordResetToken'
    | 'role'
    | 'createdAt'
    | 'refreshToken'
    | 'updatedAt'
  > {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare email: string;
  declare password: string;
  declare role: Role;
  declare isEmailVerified: boolean;
  declare verificationToken: string | null;
  declare verificationCode: string | null;
  declare passwordResetToken: string | null;
  declare refreshToken: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    paranoid: true,
    modelName: 'User',
  }
);

export default User;
