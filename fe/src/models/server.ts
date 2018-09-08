import { ItemAsset, PlayerAsset } from './asset';

export interface IServerItemState {
  asset: ItemAsset;
  name: string;
}

export interface IServerInventoryState {
  items: IServerItemState[];
}

export interface IServerPlayerState {
  id: string;
  name: string;
  asset: PlayerAsset;
  hp: number;
  money: number;
  position: number;
  inventory: IServerInventoryState;
}

export interface IServerBoardSlotState {
  index: number;
}

export interface IServerBoardState {
  length: number;
  slots: IServerBoardSlotState[];
}

export interface IServerGameState {
  id: string;
  running: boolean;
  players: { [clientId: string]: IServerPlayerState };
  board: IServerBoardState;
}

export interface ISessionState {
  gameId: string;
  clientId: string;
}
