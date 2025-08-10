import { IPlayer } from './game-types.js';
import { AnswerVariant } from '../../modules/question/types.js';

export interface IUpdatePlayersMeta {
  submittedCount: number;
  total: number;
}

export interface IUpdatePlayersResponse {
  players: IPlayer[];
  meta?: IUpdatePlayersMeta;
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

export interface ICategory {
  id: number;
  title: string;
}

export interface ICategoryTurnResponse {
  chooser: string;
  categories: ICategory[];
}

export interface IGameQuestion {
  title: string;

  [AnswerVariant.ANSWER1]: string;
  [AnswerVariant.ANSWER2]: string;
  [AnswerVariant.ANSWER3]: string;
  [AnswerVariant.ANSWER4]: string;
}

export interface ISpellInfo {
  id: number;
  title: string;
  slug: string;
  description: string;
  baseCooldown: number;
  remaining: number;
  available: boolean;
}

export interface IGetSpellsResponse {
  username: string;
  spells: ISpellInfo[];
}

export type InitPlayerAbilitiesResult =
  | {
      status: 'ok';
      data: {
        abilities: Array<{ id: number; title: string; slug: string; description: string; cooldown: number }>;
        cooldowns: Record<number, number>;
      };
    }
  | { status: 'player_not_found' }
  | { status: 'not_found' }
  | { status: 'error'; error: unknown };

export type GetPlayerSpellsResult =
  | { status: 'ok'; spells: ISpellInfo[] }
  | { status: 'player_not_found' }
  | { status: 'not_found' }
  | { status: 'error'; error: unknown };

export interface IActionsReceived {
  submittedCount: number;
  total: number;
}

export interface IAbilitiesResolved {
  results: Array<{
    from: string;
    to: string;
    abilityId: number;
    success: boolean;
    reason?: string;
  }>;
  cooldowns: Record<string, Record<number, number>>;
}
