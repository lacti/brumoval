import { ISessionState } from '../models/server';

export const readSessionFromLocalStorage = (): ISessionState => {
  return {
    gameId: window.localStorage.getItem('game-id')!,
    clientId: window.localStorage.getItem('client-id')!,
  };
};

export const storeSessionToLocalStorage = (session: ISessionState) => {
  window.localStorage.setItem('game-id', session.gameId);
  window.localStorage.setItem('client-id', session.clientId);
};

export const resetSessionFromLocalStorage = () => {
  window.localStorage.removeItem('game-id');
  window.localStorage.removeItem('client-id');
};
