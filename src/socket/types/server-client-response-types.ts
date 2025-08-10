import { IPlayer } from './game-types.js';
import { AnswerVariant } from '../../modules/question/types.js';

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
