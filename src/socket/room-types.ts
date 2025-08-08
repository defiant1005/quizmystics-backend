import { ICharacterClassAttributes } from '../modules/character-class/types.js';

export interface IPlayer {
  id: string;
  username: string;
  character: ICharacterClassAttributes;
}

export interface GameRoom {
  id: string;
  hostId: string;
  players: Record<string, IPlayer>;
  state: 'waiting' | 'playing' | 'ended';
}
