import { GameRoom, IPlayer } from './room-types.js';

class RoomManager {
  private rooms: Record<string, GameRoom> = {};

  create(roomId: string, hostId: string): boolean {
    if (this.rooms[roomId]) return false;

    this.rooms[roomId] = {
      id: roomId,
      hostId,
      players: {},
      state: 'waiting',
    };
    return true;
  }

  join(roomId: string, player: IPlayer): boolean {
    const room = this.rooms[roomId];
    if (!room) return false;

    room.players[player.id] = player;
    return true;
  }

  leave(roomId: string, playerId: string): boolean {
    const room = this.rooms[roomId];
    if (!room) return false;

    delete room.players[playerId];

    // Если никого не осталось — удаляем комнату
    if (Object.keys(room.players).length === 0) {
      delete this.rooms[roomId];
    }

    return true;
  }

  updatePlayer(roomId: string, playerId: string, updates: Partial<IPlayer>): boolean {
    const player = this.rooms[roomId]?.players[playerId];
    if (!player) return false;

    Object.assign(player, updates);
    return true;
  }

  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms[roomId];
  }

  getRooms(): GameRoom[] {
    return Object.values(this.rooms);
  }

  findRoomByPlayerId(playerId: string): GameRoom | undefined {
    return Object.values(this.rooms).find((room) => playerId in room.players);
  }
}

export const roomManager = new RoomManager();
