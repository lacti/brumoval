import * as React from 'react';
import { connect, Provider } from 'react-redux';
import './App.css';

import { AnyAction, bindActionCreators, Dispatch, Store } from 'redux';
import * as sessionActions from './actions/session';
import Game from './components/Game';
import { IRootState } from './store/state';
import { checkSession, issueSession } from './utils/session';
import {
  readSessionFromLocalStorage,
  storeSessionToLocalStorage,
} from './utils/storage';

const mapStateToProps = (state: IRootState) => state;
const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators({ ...sessionActions }, dispatch),
});

interface IAppProps
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  store: Store<IRootState, any>;
}

class App extends React.Component<IAppProps> {
  constructor(props: IAppProps) {
    super(props);
  }
  public componentWillMount() {
    const { session } = this.props;
    if (!session) {
      this.initializeSession();
    }
  }
  public render() {
    const { store, game } = this.props;
    if (game) {
      return (
        <Provider store={store}>
          <div className="App">
            <Game />
          </div>
        </Provider>
      );
    }
    return (
      <Provider store={store}>
        <div className="App">
          <p>Now loading...</p>
        </div>
      </Provider>
    );
  }

  private initializeSession = async () => {
    const oldSession = readSessionFromLocalStorage();
    if (!(await checkSession(oldSession))) {
      const newSession = await issueSession();
      storeSessionToLocalStorage(newSession);
    }
  };
}

export default connect(mapStateToProps)(App);
