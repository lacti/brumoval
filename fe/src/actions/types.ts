import * as redux from 'redux';

export enum Types {
  UPDATE_SESSION,
}

export interface IAction<T, P> extends redux.Action {
  readonly type: T;
  readonly payload: P;
}
