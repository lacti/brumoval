import * as React from 'react';
import { connect } from 'react-redux';

import { IRootState } from '../store/state';
import { Board } from './Board';
import { Inventory } from './Inventory';
import { Profiles } from './Profiles';

const mapStateToProps = (state: IRootState) => state.game!;

interface IAppProps extends ReturnType<typeof mapStateToProps> {}

const Game: React.StatelessComponent<IAppProps> = ({
  profiles,
  board,
  inventory,
}) => (
  <React.Fragment>
    <Profiles profiles={profiles} />
    <Board board={board} />
    <Inventory inventory={inventory} />
  </React.Fragment>
);

export default connect(mapStateToProps)(Game);
