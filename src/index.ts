import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { initDB } from './db/init.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './package/router.js';
import { errorMiddleware } from './middleware/error-middleware.js';
import { CORS_OPTIONS } from './package/constants.js';
import { createServer } from 'node:http';
import { initSocket } from './socket/io.js';
import { socketHandler } from './socket/handlers.js';

dotenv.config();

const app = express();
const server = createServer(app);

const io = initSocket(server);

io.on('connection', socketHandler);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors(CORS_OPTIONS));

app.use('/api', router);

//последний
app.use(errorMiddleware);

const start = async () => {
  try {
    await initDB();

    server.listen(port, () => {
      logger.info(`✅ Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

start().catch((error) => {
  console.error('Ошибка при запуске сервера:', error);
});
