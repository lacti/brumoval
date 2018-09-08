import { ActionCreator } from 'redux';
import { ISessionState } from '../store/state';
import { IAction, Types } from './types';

export type UpdateSessionAction = IAction<
  Types.UPDATE_SESSION,
  {
    session: ISessionState;
  }
>;

export const updateSession: ActionCreator<UpdateSessionAction> = (
  session: ISessionState,
): UpdateSessionAction => ({
  type: Types.UPDATE_SESSION,
  payload: {
    session,
  },
});
