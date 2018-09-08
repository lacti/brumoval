import { IBoardState, IGameState, IPlayerState } from '../models/client';
import {
  IServerGameState,
  IServerPlayerState,
  ISessionState,
} from '../models/server';
import { server } from './server';
import { readSessionFromLocalStorage } from './storage';

export const isGameReady = async () => {
  const session = readSessionFromLocalStorage();
  if (!session.gameId) {
    return Promise.resolve(false);
  }
  const ready = await server<boolean>('/ready', {
    gameId: session.gameId,
    clientId: session.clientId,
  });
  return ready;
};

const fromServerPlayer = (
  serverPlayer: IServerPlayerState,
  me: boolean = false,
): IPlayerState => {
  return {
    id: serverPlayer.id,
    name: serverPlayer.name,
    asset: serverPlayer.asset,
    hp: serverPlayer.hp,
    money: serverPlayer.money,
    position: serverPlayer.position,
  };
};

const toClientGame = (
  session: ISessionState,
  serverState: IServerGameState,
): IGameState => {
  const me = fromServerPlayer(serverState.players[session.clientId], true);
  const others = Object.values(serverState.players)
    .filter((each: IServerPlayerState) => each.id !== session.clientId)
    .map((each: IServerPlayerState) => fromServerPlayer(each));
  const players = [me, ...others];
  const inventory = serverState.players[session.clientId].inventory;
  const board: IBoardState = {
    length: serverState.board.length,
    slots: serverState.board.slots.map(slot => ({
      index: slot.index,
      players: players.filter(each => each.position === slot.index),
    })),
  };
  return {
    board,
    profiles: {
      me,
      others,
    },
    inventory,
  };
};

export const retrieveGameState = async (): Promise<IGameState> => {
  const session = readSessionFromLocalStorage();
  const serverState = await server<IServerGameState>('/game', {
    gameId: session.gameId,
    clientId: session.clientId,
  });
  return toClientGame(session, serverState);
};

export const doDice = async () => {
  const session = readSessionFromLocalStorage();
  const serverState = await server<boolean | IServerGameState>('/dice', {
    gameId: session.gameId,
    clientId: session.clientId,
  });
  if (typeof serverState === 'boolean') {
    throw new Error('Go away!');
  }
  return toClientGame(session, serverState);
};
