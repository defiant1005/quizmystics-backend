import { Sequelize } from 'sequelize';
import { config } from '../config/index.js';

export const sequelize = new Sequelize(config.db.database as string, config.db.user as string, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: false,
});
