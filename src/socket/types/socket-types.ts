export enum ClientToServerEvents {
  CREATE_ROOM = 'createRoom',
  ENTER_ROOM = 'enterRoom',
  GET_PLAYERS = 'getPlayers',
  CHANGE_PLAYER_READY = 'changePlayerReady',
  CHOOSING_CATEGORY = 'choosingCategory',
  GET_QUESTIONS = 'getQuestions',

  DISCONNECT = 'disconnect',
}

export enum ServerToClientEvents {
  ROOM_CREATED = 'roomCreated',
  UPDATE_PLAYERS = 'updatePlayers',
  SUCCESS_ENTER = 'successEnter',
  START_GAME = 'startGame',
  GAME_OVER = 'gameOver',
  CATEGORY_TURN = 'categoryTurn',
  NEW_QUESTION = 'newQuestion',

  ERROR = 'error',
}

export enum SocketErrorSlug {
  ALREADY_EXISTS = 'already_exists',
  NOT_FOUND = 'not_found',
  VALIDATE_ERROR = 'validate_error',
  ROOM_NOT_FOUND = 'room_not_found',
  GAME_IN_PROGRESS = 'game_in_progress',
  NAME_TAKEN = 'name_taken',
  EXCEEDED_LIMIT = 'exceeded_limit',
  NOT_ENOUGH_PLAYERS = 'not_enough_players',
  INTERNAL_ERROR = 'internal_error',
}

export interface SocketErrorPayload {
  message: string;
  slug: SocketErrorSlug;
}
