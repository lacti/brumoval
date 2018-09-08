import ImageOfPlayerTypeA from '../images/player/type-a.png';
import ImageOfPlayerTypeB from '../images/player/type-b.png';
import ImageOfPlayerTypeC from '../images/player/type-c.png';
import ImageOfPlayerTypeD from '../images/player/type-d.png';

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
  TypeB = ImageOfPlayerTypeB,
  TypeC = ImageOfPlayerTypeC,
  TypeD = ImageOfPlayerTypeD,
}

export interface IPlayerState {
  name: string;
  asset: PlayerAsset;
  hp: number;
  money?: number;
  position: number;
}

export interface IBoardSlotState {
  index: number;
  players: IPlayerState[];
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

export interface ISessionState {
  name: string;
  gameId: string;
  clientId: string;
}

export interface IRootState {
  session: ISessionState | null;
  game: IGameState | null;
}
