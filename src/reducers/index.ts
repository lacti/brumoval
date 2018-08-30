import * as R from 'rambda';
import { combineReducers } from 'redux';
import {
  IBoardSlotState,
  IBoardState,
  IGameState,
  IInventoryState,
  IProfilesState,
  PlayerAsset,
} from '../store/state';

const createSlots = (length: number): IBoardSlotState[] =>
  R.range(0, length * 4 + 4).map(index => ({
    index,
    player:
      Math.random() > 0.7
        ? {
            asset: PlayerAsset.TypeA,
            hp: 80,
            money: 500,
            name: '김복치',
          }
        : undefined,
  }));

const board = (
  state: IBoardState = {
    length: 5,
    slots: createSlots(5),
  },
  action: any,
) => {
  window.console.log(state);
  return state;
};
const profiles = (
  state: IProfilesState = {
    me: {
      asset: PlayerAsset.TypeA,
      hp: 80,
      money: 500,
      name: '김복치',
    },
    others: [
      {
        asset: PlayerAsset.TypeA,
        hp: 50,
        money: 100,
        name: '고복치',
      },
      {
        asset: PlayerAsset.TypeA,
        hp: 10,
        money: 300,
        name: '최복치',
      },
      {
        asset: PlayerAsset.TypeA,
        hp: 90,
        money: 1000,
        name: '장복치',
      },
      {
        asset: PlayerAsset.TypeA,
        hp: 30,
        money: 50,
        name: '이복치',
      },
    ],
  },
  action: any,
) => {
  window.console.log(state);
  return state;
};
const inventory = (
  state: IInventoryState = {
    items: [],
  },
  action: any,
) => {
  window.console.log(state);
  return state;
};

const rootReducer = combineReducers<IGameState>({
  board,
  inventory,
  profiles,
});

export default rootReducer;
