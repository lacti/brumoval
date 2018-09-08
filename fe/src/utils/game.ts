import { IGameState } from '../models/state';
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

export const retrieveGameState = () => {
  const session = readSessionFromLocalStorage();
  return server<IGameState>('/game', {
    gameId: session.gameId,
    clientId: session.clientId,
  });
};
