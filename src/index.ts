import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { initDB } from './db/init.js';
import cors from 'cors';
import { router } from './package/router.js';
import { errorHandlerMiddleware } from './error/ErrorHandlerMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', router);

//последний
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await initDB();

    app.listen(port, () => {
      logger.info(`✅ Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

start().then();
