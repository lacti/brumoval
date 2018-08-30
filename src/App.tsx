import * as React from 'react';
import { connect, Provider } from 'react-redux';
import './App.css';

import { AnyAction, Store } from 'redux';
import { Board } from './components/Board';
import { Inventory } from './components/Inventory';
import { Profiles } from './components/Profiles';
import { IGameState } from './store/state';

const mapStateToProps = (state: IGameState) => state;

interface IAppProps extends ReturnType<typeof mapStateToProps> {
  store: Store<IGameState, AnyAction>;
}

const App: React.StatelessComponent<IAppProps> = ({
  store,
  profiles,
  board,
  inventory,
}) => (
  <Provider store={store}>
    <div className="App">
      <Profiles profiles={profiles} />
      <Board board={board} />
      <Inventory inventory={inventory} />
    </div>
  </Provider>
);

export default connect(mapStateToProps)(App);
