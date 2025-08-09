import { Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { roomManager } from './room-manager.js';

import { sendSocketError } from './utils/send-socket-error.js';
import { ClientToServerEvents, ServerToClientEvents, SocketErrorSlug } from './types/socket-types.js';

import { GameState, IPlayer } from './types/game-types.js';
import {
  IChangePlayerReadyParams,
  IClientServerParams,
  ICreateRoomParams,
  IGetPlayersParams,
  IInterRoomParams,
} from './types/client-server-response-types.js';
import {
  IRoomCreatedResponse,
  ISuccessEnterResponse,
  IUpdatePlayersResponse,
} from './types/server-client-response-types.js';

export const socketHandler = (socket: Socket) => {
  logger.info(`🔌 Новый клиент: ${socket.id}`);

  socket.on(ClientToServerEvents.CREATE_ROOM, (params: ICreateRoomParams) => {
    logger.info(`📨 ${socket.id} хочет создать комнату: ${params.roomId}`);

    const created = roomManager.create(params.roomId, socket.id);

    if (!created) {
      sendSocketError(socket, SocketErrorSlug.ALREADY_EXISTS, 'Комната с таким ID уже существует');
      return;
    }

    const hostPlayer: IPlayer = {
      id: socket.id,
      username: params.name,
      characterId: params.characterId,
      isAdmin: true,
    };

    const res = roomManager.joinByName(params.roomId, hostPlayer);
    if (res.status === 'name_taken') {
      sendSocketError(socket, SocketErrorSlug.NAME_TAKEN, 'Имя уже занято в комнате');
      return;
    }

    socket.join(params.roomId);

    const roomCreatedResponse: IRoomCreatedResponse = {
      roomId: params.roomId,
      socketId: socket.id,
      name: params.name,
      isHost: true,
    };

    socket.emit(ServerToClientEvents.ROOM_CREATED, roomCreatedResponse);

    const room = roomManager.getRoom(params.roomId);

    const updatePlayersResponse: IUpdatePlayersResponse = {
      players: Object.values(room!.players),
    };
    socket.emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);

    logger.info(`✅ Комната ${params.roomId} создана хостом ${socket.id}`);
  });

  socket.on(ClientToServerEvents.ENTER_ROOM, (data: IInterRoomParams) => {
    logger.info(`📨 ${socket.id} хочет войти в комнату: ${data.roomId}`);

    if (!data.name || !data.roomId) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Укажите имя и номер комнаты');
      return;
    }

    const room = roomManager.getRoom(data.roomId);
    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    if (room.state !== GameState.WAITING) {
      sendSocketError(socket, SocketErrorSlug.GAME_IN_PROGRESS, 'Игра уже началась');
      return;
    }

    if (Object.values(room.players).length === 8) {
      sendSocketError(socket, SocketErrorSlug.EXCEEDED_LIMIT, 'Игра рассчитана до 8 игроков');
      return;
    }

    const existing = room.players[data.name.toLowerCase()];
    if (!existing && !data.characterId) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Выберите персонажа');
      return;
    }

    const player: IPlayer = {
      id: socket.id,
      username: data.name,
      characterId: data.characterId ?? existing?.characterId!,
      isAdmin: false,
    };

    const res = roomManager.joinByName(data.roomId, player);

    if (res.status === 'not_found') {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    if (res.status === 'name_taken') {
      sendSocketError(socket, SocketErrorSlug.NAME_TAKEN, 'Имя уже занято (пользователь онлайн)');
      return;
    }

    socket.join(data.roomId);
    const updatedRoom = roomManager.getRoom(data.roomId)!;

    const successEnterResponse: ISuccessEnterResponse = {
      roomId: data.roomId,
      name: data.name,
    };

    socket.emit(ServerToClientEvents.SUCCESS_ENTER, successEnterResponse);

    const updatePlayersResponse: IUpdatePlayersResponse = {
      players: Object.values(updatedRoom.players),
    };

    socket.emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);

    socket.to(data.roomId).emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);

    logger.info(`✅ ${socket.id} (${data.name}) вошёл/переподключился в комнату ${data.roomId}`);
  });

  socket.on(ClientToServerEvents.GET_PLAYERS, (data: IGetPlayersParams) => {
    if (!data.roomId) {
      sendSocketError(socket, SocketErrorSlug.ROOM_NOT_FOUND, 'Комната не найдена');
      return;
    }

    const room = roomManager.getRoom(data.roomId);
    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    const updatePlayersResponse: IUpdatePlayersResponse = {
      players: Object.values(room.players),
    };

    socket.emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);
  });

  socket.on(ClientToServerEvents.CHANGE_PLAYER_READY, (data: IChangePlayerReadyParams) => {
    if (!data.roomId || !data.username) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Заполните все поля');
      return;
    }

    roomManager.editUserReady(data.roomId, data.username, data.isReady);

    const room = roomManager.getRoom(data.roomId);

    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    const updatePlayersResponse: IUpdatePlayersResponse = {
      players: Object.values(room.players),
    };

    socket.emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);
    socket.to(data.roomId).emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);

    const allReady = Object.values(room.players).length > 1 && Object.values(room.players).every((p) => p.isReady);

    if (allReady) {
      room.state = GameState.PLAYING;

      socket.emit(ServerToClientEvents.START_GAME);
      socket.to(data.roomId).emit(ServerToClientEvents.START_GAME);
    }
  });

  socket.on(ClientToServerEvents.CHOOSING_CATEGORY, (data: IClientServerParams) => {
    if (!data.roomId) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Что-то пошло не так');
      return;
    }

    const room = roomManager.getRoom(data.roomId);
    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    if (!room.questionOrder || room.questionOrder.length === 0) {
      const initRes = roomManager.initQuestionOrder(data.roomId, 12);
      if (initRes.status !== 'ok') {
        if (initRes.status === 'not_enough_players') {
          sendSocketError(socket, SocketErrorSlug.NOT_ENOUGH_PLAYERS, 'Недостаточно игроков для начала игры');
        } else {
          sendSocketError(socket, SocketErrorSlug.INTERNAL_ERROR, 'Не удалось сформировать порядок вопросов');
        }
        return;
      }
    }

    room.currentQuestion = room.currentQuestion ?? 0;
    room.totalQuestions = room.totalQuestions ?? 12;

    const chooserRes = roomManager.getCurrentChooser(data.roomId);
    if (chooserRes.status === 'finished') {
      room.state = GameState.ENDED;
      socket.emit(ServerToClientEvents.GAME_OVER, { roomId: data.roomId });
      socket.to(data.roomId).emit(ServerToClientEvents.GAME_OVER, { roomId: data.roomId });
      return;
    }
    if (chooserRes.status !== 'ok') {
      sendSocketError(socket, SocketErrorSlug.INTERNAL_ERROR, 'Не удалось определить выбирающего');
      return;
    }

    const payload = {
      roomId: data.roomId,
      index: chooserRes.index,
      total: room.totalQuestions,
      chooser: chooserRes.chooser,
    };

    socket.emit(ServerToClientEvents.CATEGORY_TURN, payload);
    socket.to(data.roomId).emit(ServerToClientEvents.CATEGORY_TURN, payload);
  });

  socket.on(ClientToServerEvents.DISCONNECT, () => {
    logger.info(`❌ Клиент отключился: ${socket.id}`);

    const room = roomManager.markDisconnectBySocketId(socket.id);
    if (!room) return;

    const updatePlayersResponse: IUpdatePlayersResponse = {
      players: Object.values(room.players),
    };

    socket.to(room.id).emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);

    logger.info(`🚪 Игрок с socketId ${socket.id} помечен как отключённый в комнате ${room.id}`);
  });
};
