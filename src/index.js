import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {createStore} from 'redux'
import mainReducer from './reducers/mainReducer';
import { Provider } from 'react-redux';

const store = createStore(mainReducer)

ReactDOM.render(
    <Provider store={store}>
        <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();