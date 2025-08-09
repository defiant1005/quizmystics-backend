import { IPlayer } from './game-types.js';

export interface IUpdatePlayersResponse {
  players: IPlayer[];
}

export interface ISuccessEnterResponse {
  roomId: string;
  name: string;
}

export interface IRoomCreatedResponse {
  roomId: string;
  socketId: string;
  name: string;
  isHost: boolean;
}
