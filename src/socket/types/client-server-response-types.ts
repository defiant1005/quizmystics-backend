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

export interface IGetQuestionsParams extends IClientServerParams {
  categoryId: number;
}

export interface IGetSpellInfoParams extends IClientServerParams {
  username: string;
}

export interface IUseAbilityParams extends IClientServerParams {
  username: string;
  actions: Array<{
    abilityId: number;
    targetUsername: string;
  }>;
}
