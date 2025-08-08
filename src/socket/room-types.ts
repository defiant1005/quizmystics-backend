export interface IPlayer {
  id: string;
  username: string;
  characterId: number;
  isAdmin?: boolean;
}

export interface GameRoom {
  id: string;
  hostId: string;
  players: Record<string, IPlayer>;
  state: 'waiting' | 'playing' | 'ended';
}

export enum ClientToServerEvents {
  CREATE_ROOM = 'createRoom',
  ENTER_ROOM = 'enterRoom',
  GET_PLAYERS = 'getPlayers',
  DISCONNECT = 'disconnect',
}

export enum ServerToClientEvents {
  ROOM_CREATED = 'roomCreated',
  CHANGE_PLAYERS_COUNT = 'changePlayersCount',
  PLAYER_JOINED = 'playerJoined',
  SET_PLAYERS = 'setPlayers',

  ERROR = 'error',
}

export enum SocketErrorSlug {
  ALREADY_EXISTS = 'already_exists',
  NOT_FOUND = 'not_found',
  VALIDATE_ERROR = 'validate_error',
  ROOM_NOT_FOUND = 'room_not_found',
  GAME_IN_PROGRESS = 'game_in_progress',
  ALREADY_IN_ROOM = 'already_in_room',
}

export interface SocketErrorPayload {
  message: string;
  slug: SocketErrorSlug;
}

export interface IInterRoomParams {
  name: string;
  roomId: string;
  characterId: number;
}
