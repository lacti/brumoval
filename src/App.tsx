import * as React from 'react';
import './App.css';

import { Board } from './components/Board';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Board count={5} />
      </div>
    );
  }
}

export default App;
