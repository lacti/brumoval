import * as R from 'rambda';
import { combineReducers } from 'redux';
import { NAMES } from '../models/constants';
import {
  IBoardSlotState,
  IBoardState,
  IGameState,
  IInventoryState,
  IProfilesState,
  PlayerAsset,
} from '../store/state';
import { nextElement } from '../utils/rand';

const player1 = {
  asset: PlayerAsset.TypeA,
  hp: 80,
  money: 500,
  name: '김복치',
  position: 0,
};
const player2 = {
  asset: PlayerAsset.TypeB,
  hp: 50,
  money: 100,
  name: '고복치',
  position: 0,
};
const player3 = {
  asset: PlayerAsset.TypeC,
  hp: 10,
  money: 300,
  name: '최복치',
  position: 0,
};
const player4 = {
  asset: PlayerAsset.TypeD,
  hp: 90,
  money: 1000,
  name: '장복치',
  position: 0,
};
const createSlots = (length: number): IBoardSlotState[] =>
  R.range(0, length * 4 + 4).map(index => ({
    index,
    players:
      index === 0
        ? [player1]
        : index === 1
          ? [player2]
          : index === 2
            ? [player3]
            : index === 3
              ? [player4]
              : [],
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
      name: nextElement(NAMES),
      position: 0,
    },
    others: [
      {
        asset: PlayerAsset.TypeB,
        hp: 50,
        money: 100,
        name: nextElement(NAMES),
        position: 0,
      },
      {
        asset: PlayerAsset.TypeC,
        hp: 10,
        money: 300,
        name: nextElement(NAMES),
        position: 0,
      },
      {
        asset: PlayerAsset.TypeD,
        hp: 90,
        money: 1000,
        name: nextElement(NAMES),
        position: 0,
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
