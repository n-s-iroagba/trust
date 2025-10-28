import { DataTypes, Model, type Optional } from 'sequelize'
import sequelize from '../config/database'

interface ClientAttributes {
  id: number
  lastName: string
  firstName: string
  userId: number
  pin: string
  recoveryPhrase: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ClientCreationAttributes
  extends Optional<
    ClientAttributes,
    | 'id'
  > { }

class Client extends Model<ClientAttributes, ClientCreationAttributes> {
  declare id: number
  declare userId: number
  declare firstName: string
  declare lastName: string
  declare pin: string
  declare recoveryPhrase: string[]

  // timestamps
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recoveryPhrase: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'Clients',
    paranoid: true, // Enable soft deletes
  }
)

export default Client