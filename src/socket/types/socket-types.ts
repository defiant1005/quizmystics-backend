export enum ClientToServerEvents {
  CREATE_ROOM = 'createRoom',
  ENTER_ROOM = 'enterRoom',
  GET_PLAYERS = 'getPlayers',
  CHANGE_PLAYER_READY = 'changePlayerReady',
  CHOOSING_CATEGORY = 'choosingCategory',
  GET_QUESTIONS = 'getQuestions',
  GET_SPELL_INFO = 'getSpellInfo',
  USE_ABILITIES = 'useAbilities',

  DISCONNECT = 'disconnect',
}

export enum ServerToClientEvents {
  ROOM_CREATED = 'roomCreated',
  UPDATE_PLAYERS = 'updatePlayers',
  SUCCESS_ENTER = 'successEnter',
  START_GAME = 'startGame',
  CATEGORY_TURN = 'categoryTurn',
  NEW_QUESTION = 'newQuestion',
  SPELL_INFO = 'spellInfo',
  ACTIONS_RECEIVED = 'actionsReceived',
  ABILITIES_RESOLVED = 'abilitiesResolved',

  GAME_OVER = 'gameOver',
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
  ALREADY_SUBMITTED = 'already_submitted',
  NOT_ENOUGH_PLAYERS = 'not_enough_players',
  INTERNAL_ERROR = 'internal_error',
}

export interface SocketErrorPayload {
  message: string;
  slug: SocketErrorSlug;
}
