import { Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { roomManager } from './rooms.js';
import {
  ClientToServerEvents,
  IInterRoomParams,
  IPlayer,
  ServerToClientEvents,
  SocketErrorSlug,
} from './room-types.js';
import { sendSocketError } from './utils/send-socket-error.js';

export const socketHandler = (socket: Socket) => {
  logger.info(`🔌 Новый клиент: ${socket.id}`);

  socket.on(ClientToServerEvents.CREATE_ROOM, ({ name, roomId, characterId }) => {
    logger.info(`📨 ${socket.id} хочет создать комнату: ${roomId}`);

    const created = roomManager.create(roomId, socket.id);

    if (!created) {
      sendSocketError(socket, SocketErrorSlug.ALREADY_EXISTS, 'Комната с таким ID уже существует');
      return;
    }

    const hostPlayer: IPlayer = {
      id: socket.id,
      username: name,
      characterId: characterId,
      isAdmin: true,
    };
    roomManager.join(roomId, hostPlayer);

    socket.join(roomId);
    socket.emit(ServerToClientEvents.ROOM_CREATED, { roomId, socketId: socket.id });

    logger.info(`✅ Комната ${roomId} создана хостом ${socket.id}`);
  });

  socket.on(ClientToServerEvents.ENTER_ROOM, ({ name, roomId, characterId }: IInterRoomParams) => {
    logger.info(`📨 ${socket.id} хочет войти в комнату: ${roomId}`);

    if (!name || !roomId || !characterId) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Заполните все поля');

      return;
    }

    const room = roomManager.getRoom(roomId);

    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');

      return;
    }

    if (room.state !== 'waiting') {
      sendSocketError(socket, SocketErrorSlug.GAME_IN_PROGRESS, 'Игра уже началась');

      return;
    }

    if (room.players[socket.id]) {
      sendSocketError(socket, SocketErrorSlug.ALREADY_IN_ROOM, 'Комната с таким ID уже существует');

      return;
    }

    const player: IPlayer = {
      id: socket.id,
      username: name,
      characterId: characterId,
      isAdmin: false,
    };

    roomManager.join(roomId, player);
    socket.join(roomId);

    logger.info(`✅ ${socket.id} вошёл в комнату ${roomId}`);

    socket.emit(ServerToClientEvents.CHANGE_PLAYERS_COUNT, { roomId, players: Object.values(room.players) });
    socket.emit(ServerToClientEvents.PLAYER_JOINED, { roomId, socketId: socket.id });
    socket.to(roomId).emit(ServerToClientEvents.CHANGE_PLAYERS_COUNT, { players: Object.values(room.players) });
  });

  socket.on(ClientToServerEvents.GET_PLAYERS, ({ roomId }) => {
    if (!roomId) {
      sendSocketError(socket, SocketErrorSlug.ROOM_NOT_FOUND, 'Комната не найдена');

      return;
    }

    logger.info(`📨 ${socket.id} запросил список игроков комнаты: ${roomId}`);

    const room = roomManager.getRoom(roomId);

    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    socket.emit(ServerToClientEvents.SET_PLAYERS, { players: Object.values(room.players) });
  });

  socket.on(ClientToServerEvents.DISCONNECT, () => {
    logger.info(`❌ Клиент отключился: ${socket.id}`);

    // Находим комнату, где был этот игрок
    //todo: тут нужно продумать удаление
    const room = roomManager.findRoomByPlayerId(socket.id);
    if (!room) return;

    // Удаляем игрока
    roomManager.leave(room.id, socket.id);

    logger.info(`🚪 Игрок ${socket.id} вышел из комнаты ${room.id}`);

    // Если игроков больше нет — удаляем комнату
    if (Object.keys(room.players).length === 0) {
      logger.info(`🗑 Комната ${room.id} удалена (пустая)`);
    } else {
      // Оповещаем остальных, что игрок вышел
      socket.to(room.id).emit('playerLeft', { players: Object.values(room.players) });
      socket.to(room.id).emit('changePlayersCount', { players: Object.values(room.players) });
    }
  });
};
