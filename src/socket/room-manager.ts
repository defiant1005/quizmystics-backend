import { GameRoom, GameState, IPlayer } from './types/game-types.js';

const RECONNECT_TTL = 120000;

class RoomManager {
  private rooms: Record<string, GameRoom> = {};
  private cleanupTimers: Record<string, Record<string, ReturnType<typeof setTimeout>>> = {};

  create(roomId: string, hostId: string) {
    if (this.rooms[roomId]) return false;
    this.rooms[roomId] = {
      id: roomId,
      hostId,
      players: {},
      state: GameState.WAITING,
      questionOrder: undefined,
      currentQuestion: undefined,
      totalQuestions: undefined,
    };
    this.cleanupTimers[roomId] = {};
    return true;
  }

  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms[roomId];
  }

  joinByName(roomId: string, player: IPlayer) {
    const room = this.rooms[roomId];
    if (!room) return { status: 'not_found' as const };

    const key = player.username.toLowerCase();
    const existing = room.players[key];

    if (existing && !existing.disconnectedAt) {
      return { status: 'name_taken' as const };
    }

    if (existing && existing.disconnectedAt) {
      existing.id = player.id;
      existing.characterId = player.characterId ?? existing.characterId;
      delete existing.disconnectedAt;
      this.cancelCleanupTimer(roomId, key);
      return { status: 'reconnected' as const, player: existing };
    }

    room.players[key] = { ...player };
    return { status: 'joined' as const, player: room.players[key] };
  }

  editUserReady(roomId: string, username: string, isReady: boolean) {
    const room = this.rooms[roomId];
    if (!room) return;
    const user_key = username.toLowerCase();
    const user = room.players[user_key];
    if (!user) return;
    user.isReady = isReady;
  }

  initQuestionOrder(roomId: string, totalQuestions = 12) {
    const room = this.rooms[roomId];
    if (!room) return { status: 'not_found' as const };

    const allPlayers = Object.values(room.players).filter((p) => !p.disconnectedAt);
    if (allPlayers.length < 2) {
      return { status: 'not_enough_players' as const, count: allPlayers.length };
    }

    const names = allPlayers.map((p) => p.username);

    const shuffle = <T>(arr: T[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const order: string[] = [];
    while (order.length < totalQuestions) {
      const round = shuffle([...names]);
      order.push(...round);
    }

    room.questionOrder = order.slice(0, totalQuestions);
    room.currentQuestion = 0;
    room.totalQuestions = totalQuestions;

    return { status: 'ok' as const, questionOrder: room.questionOrder };
  }

  getCurrentChooser(roomId: string) {
    const room = this.rooms[roomId];
    if (!room || !room.questionOrder || room.currentQuestion === undefined || room.totalQuestions === undefined) {
      return { status: 'not_ready' as const };
    }

    let idx = room.currentQuestion;
    while (idx < room.totalQuestions) {
      const username = room.questionOrder[idx];
      const key = username.toLowerCase();
      const player = room.players[key];
      if (player && !player.disconnectedAt) {
        return { status: 'ok' as const, index: idx, chooser: username };
      }
      idx++;
    }

    return { status: 'finished' as const };
  }

  advanceQuestion(roomId: string) {
    const room = this.rooms[roomId];
    if (!room || room.currentQuestion === undefined || room.totalQuestions === undefined) {
      return { status: 'not_ready' as const };
    }

    room.currentQuestion = room.currentQuestion + 1;

    if (room.currentQuestion >= room.totalQuestions) {
      room.currentQuestion = room.totalQuestions;
      return { status: 'finished' as const };
    }

    return this.getCurrentChooser(roomId);
  }

  findRoomByPlayerId(socketId: string): GameRoom | undefined {
    return Object.values(this.rooms).find((room) => Object.values(room.players).some((p) => p.id === socketId));
  }

  markDisconnectBySocketId(socketId: string): GameRoom | undefined {
    const room = this.findRoomByPlayerId(socketId);
    if (!room) return;

    const key = Object.keys(room.players).find((k) => room.players[k].id === socketId);
    if (!key) return room;

    const player = room.players[key];
    player.disconnectedAt = Date.now();

    // schedule removal after TTL
    if (!this.cleanupTimers[room.id]) this.cleanupTimers[room.id] = {};
    this.cancelCleanupTimer(room.id, key);

    this.cleanupTimers[room.id][key] = setTimeout(() => {
      delete room.players[key];
      delete this.cleanupTimers[room.id][key];

      if (Object.keys(room.players).length === 0) {
        delete this.rooms[room.id];
        delete this.cleanupTimers[room.id];
      }
    }, RECONNECT_TTL);

    return room;
  }

  cancelCleanupTimer(roomId: string, usernameKey: string) {
    const t = this.cleanupTimers?.[roomId]?.[usernameKey];
    if (t) {
      clearTimeout(t);
      delete this.cleanupTimers[roomId][usernameKey];
    }
  }

  deleteRoom(roomId: string) {
    const timers = this.cleanupTimers[roomId] ?? {};
    Object.values(timers).forEach(clearTimeout);
    delete this.cleanupTimers[roomId];
    delete this.rooms[roomId];
  }
}

export const roomManager = new RoomManager();
