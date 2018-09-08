import * as React from 'react';

import { IGameState } from '../models/client';
import { Board } from './Board';
import { Inventory } from './Inventory';
import { Profiles } from './Profiles';

const Game: React.StatelessComponent<{ game: IGameState }> = ({ game }) => (
  <React.Fragment>
    <Profiles profiles={game.profiles} />
    <Board board={game.board} />
    <Inventory inventory={game.inventory} />
  </React.Fragment>
);

export default Game;
