import { ISessionState } from '../store/state';

export const readSessionFromLocalStorage = (): ISessionState => {
  return {
    gameId: window.localStorage.getItem('game-id')!,
    clientId: window.localStorage.getItem('client-id')!,
    name: window.localStorage.getItem('name')!,
  };
};

export const storeSessionToLocalStorage = (session: ISessionState) => {
  window.localStorage.setItem('game-id', session.gameId);
  window.localStorage.setItem('client-id', session.clientId);
  window.localStorage.setItem('name', session.name);
};
