import { ISessionState } from '../models/state';
import { server } from './server';

export const checkSession = (session: ISessionState) => {
  if (!session.gameId || !session.clientId) {
    return Promise.resolve(false);
  }
  return server<boolean>(`/checkSession`, {
    gameId: session.gameId,
    clientId: session.clientId,
  });
};

export const issueSession = () => {
  return server<ISessionState>(`/issueSession`, {});
};
