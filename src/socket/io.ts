import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { CORS_OPTIONS } from '../package/constants.js';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: CORS_OPTIONS,
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io не инициализирован');
  return io;
};
