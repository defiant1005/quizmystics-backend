import { Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { roomManager } from './rooms.js';
import { IPlayer } from './room-types.js';

export const socketHandler = (socket: Socket) => {
  logger.info(`🔌 Новый клиент: ${socket.id}`);

  socket.on('createRoom', ({ roomId, username, character }) => {
    logger.info(`📨 ${socket.id} хочет создать комнату: ${roomId}`);

    const created = roomManager.create(roomId, socket.id);

    if (!created) {
      socket.emit('error', {
        message: 'Комната с таким ID уже существует',
        slug: 'already_exists',
      });
      return;
    }

    const hostPlayer: IPlayer = {
      id: socket.id,
      username: username || 'Host',
      character: character || null,
    };
    roomManager.join(roomId, hostPlayer);

    socket.join(roomId);
    socket.emit('roomCreated', { roomId, hostId: socket.id });

    logger.info(`✅ Комната ${roomId} создана хостом ${socket.id}`);
  });

  socket.on('enterRoom', ({ roomId, username, character }) => {
    logger.info(`📨 ${socket.id} хочет войти в комнату: ${roomId}`);

    const room = roomManager.getRoom(roomId);

    if (!room) {
      socket.emit('error', {
        message: 'Комната не найдена',
        slug: 'not_found',
      });
      return;
    }

    if (room.state !== 'waiting') {
      socket.emit('error', {
        message: 'Нельзя войти — игра уже началась',
        slug: 'game_in_progress',
      });
      return;
    }

    if (room.players[socket.id]) {
      socket.emit('error', {
        message: 'Вы уже в этой комнате',
        slug: 'already_in_room',
      });
      return;
    }

    const player: IPlayer = {
      id: socket.id,
      username: username || 'Guest',
      character: character || null,
    };

    roomManager.join(roomId, player);
    socket.join(roomId);

    logger.info(`✅ ${socket.id} вошёл в комнату ${roomId}`);

    socket.emit('changePlayersCount', { roomId, players: Object.values(room.players) });
    socket.emit('userJoined', { roomId });
    socket.to(roomId).emit('changePlayersCount', { players: Object.values(room.players) });
  });

  socket.on('disconnect', () => {
    logger.info(`❌ Клиент отключился: ${socket.id}`);

    // Находим комнату, где был этот игрок
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
