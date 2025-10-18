import { DataTypes, Model, type Optional } from 'sequelize'
import sequelize from '../config/database'
import {Role} from '../types/auth.types'




interface UserAttributes {
  id: number
  username: string
  email: string
  password: string
  role: Role
  signInCode:string
  phrase12Word:string[]
  isEmailVerified: boolean
  verificationCode?: string | null
  verificationToken?: string | null
  passwordResetToken?: string | null
  refreshToken?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'isEmailVerified'
    | 'verificationCode'
    | 'verificationToken'
    | 'passwordResetToken'
    | 'signInCode'
    | 'phrase12Word'
    | 'role'
    | 'createdAt'
    | 'refreshToken'
    | 'updatedAt'
    | 'password'
  > { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public username!: string
  public email!: string
  public password!: string
  public role!: Role
  public signInCode:string
  public phrase12Word:string[]
  public isEmailVerified!: boolean
  public verificationToken!: string | null
  public refreshToken?: string | null
  public verificationCode!: string | null
  public passwordResetToken!: string | null

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date


}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
       signInCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
       phrase12Word: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  
    passwordResetToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
    },
      },

  
  {
    sequelize,
    tableName: 'users',
    paranoid: true, // Enable soft deletes
  }
)

export default User