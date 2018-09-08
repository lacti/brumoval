import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { IRootState } from './state';

export const configureStore = <S extends IRootState>(initialState?: S) => {
  const production = process.env.NODE_ENV === 'production';
  const composer = production
    ? compose
    : (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middlewares = production ? [thunk] : [logger, thunk];
  const enhancer = composer(applyMiddleware(...middlewares));
  return initialState
    ? createStore(rootReducer, initialState, enhancer)
    : createStore(rootReducer, enhancer);
};
