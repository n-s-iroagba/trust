import { Options } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
const databaseConfig: Options = {
  database: process.env.DB_NAME || 'trustxwallet',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};

export default databaseConfig;