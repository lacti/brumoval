import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './store';

const store = configureStore();

ReactDOM.render(<App store={store} />, document.getElementById(
  'root',
) as HTMLElement);
registerServiceWorker();
