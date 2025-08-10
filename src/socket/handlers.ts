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
  IGetQuestionsParams,
  IGetSpellInfoParams,
  IInterRoomParams,
  IUseAbilityParams,
} from './types/client-server-response-types.js';
import {
  IAbilitiesResolved,
  IActionsReceived,
  ICategoryTurnResponse,
  IGameQuestion,
  IGetSpellsResponse,
  IRoomCreatedResponse,
  ISpellInfo,
  ISuccessEnterResponse,
  IUpdatePlayersResponse,
} from './types/server-client-response-types.js';
import { shuffleArray } from './utils/shuffle-array.js';
import { getRandomQuestionByCategory } from '../modules/question/question-service.js';
import { AnswerVariant } from '../modules/question/types.js';

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

  socket.on(ClientToServerEvents.CHOOSING_CATEGORY, async (data: IClientServerParams) => {
    const room = roomManager.getRoom(data.roomId);

    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    if (!room.chooserQueue || room.chooserQueue.length === 0) {
      room.chooserQueue = shuffleArray(Object.keys(room.players));
    }
    const chooserId = room.chooserQueue.shift()!;
    const chooser = room.players[chooserId];

    const allCategories = await roomManager.getAllCategories();
    if (!room.usedCategories) {
      room.usedCategories = [];
    }

    let available = allCategories.filter((c) => !room.usedCategories.includes(c.id));

    if (available.length < 4) {
      room.usedCategories = [];
      available = allCategories;
    }

    const chosenCategories = shuffleArray(available).slice(0, 4);

    room.usedCategories.push(...chosenCategories.map((c) => c.id));

    const payload: ICategoryTurnResponse = {
      chooser: chooser.username,
      categories: chosenCategories.map((c) => {
        return {
          id: c.id,
          title: c.title,
        };
      }),
    };

    socket.to(data.roomId).emit(ServerToClientEvents.CATEGORY_TURN, payload);
    socket.emit(ServerToClientEvents.CATEGORY_TURN, payload);
  });

  socket.on(ClientToServerEvents.GET_QUESTIONS, async (data: IGetQuestionsParams) => {
    const room = roomManager.getRoom(data.roomId);

    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    const { categoryId } = data;
    if (!categoryId) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Не передан categoryId');
      return;
    }

    if (!room.usedQuestionIds) {
      room.usedQuestionIds = [];
    }

    const question = await getRandomQuestionByCategory(categoryId, room.usedQuestionIds);

    if (!question) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Вопросы в этой категории закончились');
      return;
    }

    room.usedQuestionIds.push(question.id);

    const newQuestionParams: IGameQuestion = {
      title: question.title,
      answer1: question[AnswerVariant.ANSWER1],
      answer2: question[AnswerVariant.ANSWER2],
      answer3: question[AnswerVariant.ANSWER3],
      answer4: question[AnswerVariant.ANSWER4],
    };

    socket.emit(ServerToClientEvents.NEW_QUESTION, newQuestionParams);
    socket.to(data.roomId).emit(ServerToClientEvents.NEW_QUESTION, newQuestionParams);
  });

  socket.on(ClientToServerEvents.GET_SPELL_INFO, async (data: IGetSpellInfoParams) => {
    if (!data.roomId || !data.username) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Не переданы параметры');
      return;
    }

    const res = await roomManager.getPlayerSpellInfo(data.roomId, data.username);

    if (res.status === 'not_found') {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    if (res.status === 'player_not_found') {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Игрок не найден в комнате');
      return;
    }

    if (res.status === 'error') {
      logger.error('Ошибка при getPlayerSpellInfo:', res.error);
      sendSocketError(socket, SocketErrorSlug.INTERNAL_ERROR, 'Ошибка при получении умений');
      return;
    }

    const params: IGetSpellsResponse = {
      username: data.username,
      spells: res.spells,
    };

    socket.emit(ServerToClientEvents.SPELL_INFO, params);
  });

  socket.on(ClientToServerEvents.USE_ABILITIES, (data: IUseAbilityParams) => {
    if (!data.roomId || !data.username) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Не переданы параметры');
      return;
    }

    const room = roomManager.getRoom(data.roomId);
    if (!room) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }

    const player = roomManager.getPlayer(data.roomId, data.username);
    if (!player) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Игрок не найден в комнате');
      return;
    }
    if (player.disconnectedAt) {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Игрок отключён');
      return;
    }

    const actions = data.actions ?? [];
    if (!Array.isArray(actions)) {
      sendSocketError(socket, SocketErrorSlug.VALIDATE_ERROR, 'Неверный формат actions');
      return;
    }

    const submitRes = roomManager.submitPlayerActions(data.roomId, data.username, actions);
    if (submitRes.status === 'not_found') {
      sendSocketError(socket, SocketErrorSlug.NOT_FOUND, 'Комната не найдена');
      return;
    }
    if (submitRes.status === 'already_submitted') {
      sendSocketError(socket, SocketErrorSlug.ALREADY_SUBMITTED, 'Вы уже отправили действия на этот ход');
      return;
    }

    const updatePlayersResponse: IUpdatePlayersResponse = {
      players: Object.values(room.players),
      meta: { submittedCount: submitRes.submittedCount, total: submitRes.total },
    };

    socket.to(data.roomId).emit(ServerToClientEvents.UPDATE_PLAYERS, updatePlayersResponse);

    const params: IActionsReceived = {
      submittedCount: submitRes.submittedCount,
      total: submitRes.total,
    };

    socket.emit(ServerToClientEvents.ACTIONS_RECEIVED, params);

    if (!submitRes.complete) return;

    const resolveRes = roomManager.resolvePendingActions(data.roomId);
    if (resolveRes.status !== 'ok') {
      sendSocketError(socket, SocketErrorSlug.INTERNAL_ERROR, 'Ошибка при обработке действий');
      return;
    }

    const abilityParams: IAbilitiesResolved = {
      results: resolveRes.results,
      cooldowns: resolveRes.cooldownSnapshot,
    };

    socket.to(data.roomId).emit(ServerToClientEvents.ABILITIES_RESOLVED, abilityParams);
    socket.emit(ServerToClientEvents.ABILITIES_RESOLVED, abilityParams);

    const updatedPlayersPayload: IUpdatePlayersResponse = { players: Object.values(room.players) };

    socket.emit(ServerToClientEvents.UPDATE_PLAYERS, updatedPlayersPayload);
    socket.to(data.roomId).emit(ServerToClientEvents.UPDATE_PLAYERS, updatedPlayersPayload);
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
