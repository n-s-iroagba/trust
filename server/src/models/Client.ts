import { DataTypes, Model, type Optional } from 'sequelize'
import sequelize from '../config/database'





interface ClientAttributes {
  id: number
  lastName: string
  firstName: string
  userId:string
  signInCode:string
  phrase12Word:string[]

  createdAt?: Date
  updatedAt?: Date
}

export interface ClientCreationAttributes
  extends Optional<
    ClientAttributes,
    | 'id'


  > { }

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number
  public userId:string;
  public firstName!: string
  public lastName!: string
  public signInCode:string
  public phrase12Word:string[]

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date


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
      primaryKey: true,
      autoIncrement: true,
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