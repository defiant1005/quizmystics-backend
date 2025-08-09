export interface IPlayer {
  id: string;
  username: string;
  characterId: number;
  isAdmin?: boolean;
  disconnectedAt?: number;
  isReady?: boolean;
}

export enum GameState {
  WAITING = 'waiting',
  PLAYING = 'playing',
  ENDED = 'ended',
}

export interface GameRoom {
  id: string;
  hostId: string;
  players: Record<string, IPlayer>;
  state: GameState;

  questionOrder?: string[];
  currentQuestion?: number;
  totalQuestions?: number;
}
