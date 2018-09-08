import ImageOfPlayerTypeA from '../images/player/type-a.png';
import ImageOfPlayerTypeB from '../images/player/type-b.png';
import ImageOfPlayerTypeC from '../images/player/type-c.png';
import ImageOfPlayerTypeD from '../images/player/type-d.png';
import { ItemAsset, PlayerAsset } from './asset';
import { IServerInventoryState } from './server';

export const asItemImage = (asset: ItemAsset) => {
  switch (asset) {
    case ItemAsset.BlackBean:
      return 'black-bean.png';
  }
};

export const asPlayerImage = (asset: PlayerAsset) => {
  switch (asset) {
    case PlayerAsset.TypeA:
      return ImageOfPlayerTypeA;
    case PlayerAsset.TypeB:
      return ImageOfPlayerTypeB;
    case PlayerAsset.TypeC:
      return ImageOfPlayerTypeC;
    case PlayerAsset.TypeD:
      return ImageOfPlayerTypeD;
  }
};

export interface IPlayerState {
  id: string;
  name: string;
  asset: PlayerAsset;
  hp: number;
  money: number;
  position: number;
}

export interface IBoardSlotState {
  index: number;
  players: IPlayerState[];
}

export interface IBoardState {
  length: number;
  slots: IBoardSlotState[];
  billboard: IPlayerState[];
}

export interface IProfilesState {
  me: IPlayerState;
  others: IPlayerState[];
}

export interface IGameState {
  profiles: IProfilesState;
  board: IBoardState;
  inventory: IServerInventoryState;
}
