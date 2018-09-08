import { IBoardState, IGameState, IPlayerState } from '../models/client';
import {
  IServerGameState,
  IServerPlayerState,
  ISessionState,
} from '../models/server';
import { server } from './server';
import {
  readSessionFromLocalStorage,
  resetSessionFromLocalStorage,
} from './storage';

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
  window.console.log(players);
  const inventory = serverState.players[session.clientId].inventory;
  const board: IBoardState = {
    length: serverState.board.length,
    slots: serverState.board.slots.map(slot => ({
      index: slot.index,
      players: players.filter(
        each => each.position === slot.index && each.hp > 0,
      ),
    })),
    billboard: players
      .filter(each => each.hp <= 0)
      .sort((a, b) => b.money - a.money),
  };
  return {
    board,
    profiles: {
      me,
      others: others.filter(each => each.hp > 0),
    },
    inventory,
  };
};

export const retrieveGameState = async (): Promise<IGameState> => {
  const session = readSessionFromLocalStorage();
  const serverState = await server<boolean | IServerGameState>('/game', {
    gameId: session.gameId,
    clientId: session.clientId,
  });
  if (typeof serverState === 'boolean') {
    throw new Error('Go away!');
  }
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
  const game = toClientGame(session, serverState);
  if (game.profiles.me.hp === 0) {
    if (window.prompt('Do you want to reset your life?', 'yes') === 'yes') {
      resetSessionFromLocalStorage();
      window.location.reload();
    }
  }
  return game;
};
