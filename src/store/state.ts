import ImageOfPlayerTypeA from '../images/player/type-a.png';

export enum ItemAsset {
  BlackBean = 'black-bean.png',
}

export interface IItemState {
  asset: ItemAsset;
  name: string;
}

export interface IInventoryState {
  items: IItemState[];
}

export enum PlayerAsset {
  TypeA = ImageOfPlayerTypeA,
}

export interface IPlayerState {
  name: string;
  asset: PlayerAsset;
  hp: number;
  money?: number;
}

export interface IBoardSlotState {
  index: number;
  player?: IPlayerState;
}

export interface IBoardState {
  length: number;
  slots: IBoardSlotState[];
}

export interface IProfilesState {
  me?: IPlayerState;
  others: IPlayerState[];
}

export interface IGameState {
  profiles: IProfilesState;
  board: IBoardState;
  inventory: IInventoryState;
}
