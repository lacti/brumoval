import { ISessionState } from '../store/state';

const session = (state: ISessionState, action: any): ISessionState | null => {
  if (!state) {
    return null;
  }
  return state;
};
export default session;
