import { GameRoom, IPlayer } from './room-types.js';

const RECONNECT_TTL = 600000;

class RoomManager {
  private rooms: Record<string, GameRoom> = {};
  private cleanupTimers: Record<string, Record<string, ReturnType<typeof setTimeout>>> = {};

  create(roomId: string, hostId: string) {
    if (this.rooms[roomId]) return false;
    this.rooms[roomId] = {
      id: roomId,
      hostId,
      players: {},
      state: 'waiting',
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
    // clear any existing timer just in case
    this.cancelCleanupTimer(room.id, key);

    this.cleanupTimers[room.id][key] = setTimeout(() => {
      // remove player permanently
      delete room.players[key];
      delete this.cleanupTimers[room.id][key];

      // if room empty -> delete room and its timers container
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
