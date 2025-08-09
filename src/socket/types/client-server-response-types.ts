export interface IClientServerParams {
  roomId: string;
}

export interface IInterRoomParams extends IClientServerParams {
  name: string;
  characterId: number;
}

export interface ICreateRoomParams extends IClientServerParams {
  name: string;
  characterId: number;
}

export interface IGetPlayersParams extends IClientServerParams {}

export interface IChangePlayerReadyParams extends IClientServerParams {
  isReady: boolean;
  username: string;
}
