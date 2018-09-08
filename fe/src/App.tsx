import * as React from 'react';
import './App.css';

import Game from './components/Game';
import { IGameState, ISessionState } from './models/state';
import { checkSession, issueSession } from './utils/session';
import {
  readSessionFromLocalStorage,
  storeSessionToLocalStorage,
} from './utils/storage';

import * as sleep from 'then-sleep';
import { isGameReady, retrieveGameState } from './utils/game';

interface IAppStates {
  session?: ISessionState;
  game?: IGameState;
}

class App extends React.Component<{}, IAppStates> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }
  public componentWillMount() {
    const { session } = this.state;
    if (!session) {
      this.initializeSession();
    }
  }
  public render() {
    const { game } = this.state;
    if (game) {
      return (
        <div className="App">
          <Game game={game} />
        </div>
      );
    }
    return (
      <div className="App">
        <p>Now loading...</p>
      </div>
    );
  }

  private initializeSession = async () => {
    const oldSession = readSessionFromLocalStorage();
    if (!(await checkSession(oldSession))) {
      const newSession = await issueSession();
      storeSessionToLocalStorage(newSession);
      window.console.log(newSession);
      this.setState({
        session: newSession,
      });
    }
    this.checkGameState();
  };

  private checkGameState = async () => {
    while (!isGameReady()) {
      await sleep(1000);
    }
    const game = await retrieveGameState();
    this.setState({
      game,
    });
  };
}

export default App;
