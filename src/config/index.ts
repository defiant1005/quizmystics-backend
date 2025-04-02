import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
