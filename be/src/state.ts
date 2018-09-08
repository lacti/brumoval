export enum ItemAsset {
  BlackBean,
}

export interface IItemState {
  asset: ItemAsset;
  name: string;
}

export interface IInventoryState {
  items: IItemState[];
}

export enum PlayerAsset {
  TypeA,
  TypeB,
  TypeC,
  TypeD,
}

export interface IPlayerState {
  id: string;
  name: string;
  asset: PlayerAsset;
  hp: number;
  money: number;
  position: number;
  inventory: IInventoryState;
}

export interface IBoardSlotState {
  index: number;
}

export interface IBoardState {
  length: number;
  slots: IBoardSlotState[];
}

export interface IGameState {
  id: string;
  running: boolean;
  players: { [clientId: string]: IPlayerState };
  board: IBoardState;
}

export interface ISessionState {
  gameId: string;
  clientId: string;
}
