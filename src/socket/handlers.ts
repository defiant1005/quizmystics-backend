// handlers.ts
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
      characterId,
      isAdmin: true,
    };

    const res = roomManager.joinByName(roomId, hostPlayer);
    if (res.status === 'name_taken') {
      // маловероятный кейс — имя хоста уже занято (скорее всего логика фронта не даст)
      sendSocketError(socket, SocketErrorSlug.NAME_TAKEN, 'Имя уже занято в комнате');
      return;
    }

    socket.join(roomId);
    socket.emit(ServerToClientEvents.ROOM_CREATED, { roomId, socketId: socket.id, name });

    // оповестим всех участников (сейчас только хост)
    const room = roomManager.getRoom(roomId);
    socket.emit(ServerToClientEvents.SET_PLAYERS, { players: Object.values(room!.players) });

    logger.info(`✅ Комната ${roomId} создана хостом ${socket.id}`);
  });

  socket.on(ClientToServerEvents.ENTER_ROOM, ({ name, roomId, characterId }: IInterRoomParams) => {
    logger.info(`📨 ${socket.id} хочет войти в комнату: ${roomId}`);

    if (!name || !roomId) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Укажите имя и номер комнаты');
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

    // Если это новый игрок — обязателен characterId
    const existing = room.players[name.toLowerCase()];
    if (!existing && !characterId) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Выберите персонажа');
      return;
    }

    const player: IPlayer = {
      id: socket.id,
      username: name,
      characterId: characterId ?? existing?.characterId!,
      isAdmin: false,
    };

    const res = roomManager.joinByName(roomId, player);

    if (res.status === 'not_found') {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    if (res.status === 'name_taken') {
      sendSocketError(socket, SocketErrorSlug.NAME_TAKEN, 'Имя уже занято (пользователь онлайн)');
      return;
    }

    // joined OR reconnected
    socket.join(roomId);
    const updatedRoom = roomManager.getRoom(roomId)!;

    socket.emit(ServerToClientEvents.SET_PLAYERS, { players: Object.values(updatedRoom.players), roomId, name });
    socket
      .to(roomId)
      .emit(ServerToClientEvents.SET_PLAYERS, { players: Object.values(updatedRoom.players), roomId, name });

    socket.emit(ServerToClientEvents.CHANGE_PLAYERS_COUNT, { roomId, players: Object.values(updatedRoom.players) });
    socket.to(roomId).emit(ServerToClientEvents.CHANGE_PLAYERS_COUNT, { players: Object.values(updatedRoom.players) });

    logger.info(`✅ ${socket.id} (${name}) вошёл/переподключился в комнату ${roomId}`);
  });

  socket.on(ClientToServerEvents.GET_PLAYERS, ({ roomId }) => {
    if (!roomId) {
      sendSocketError(socket, SocketErrorSlug.ROOM_NOT_FOUND, 'Комната не найдена');
      return;
    }

    const room = roomManager.getRoom(roomId);
    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    socket.emit(ServerToClientEvents.SET_PLAYERS, { players: Object.values(room.players) });
  });

  socket.on(ClientToServerEvents.DISCONNECT, () => {
    logger.info(`❌ Клиент отключился: ${socket.id}`);

    const room = roomManager.markDisconnectBySocketId(socket.id);
    if (!room) return;

    // уведомляем остальных, что статус игроков изменился (у кого-то появился disconnectedAt)
    socket.to(room.id).emit(ServerToClientEvents.SET_PLAYERS, { players: Object.values(room.players) });
    socket.to(room.id).emit(ServerToClientEvents.CHANGE_PLAYERS_COUNT, { players: Object.values(room.players) });

    logger.info(`🚪 Игрок с socketId ${socket.id} помечен как отключённый в комнате ${room.id}`);
  });
};
